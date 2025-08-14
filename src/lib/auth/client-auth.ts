import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { ProjectClient, ClientSession } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export interface ClientUser {
  id: string
  email: string
  firstName: string
  lastName: string
  projectId: string
  companyId?: string
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export async function generateToken(client: ProjectClient): Promise<string> {
  const token = await new SignJWT({
    id: client.id,
    email: client.email,
    projectId: client.projectId
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
  
  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

// Create client session
export async function createClientSession(clientId: string): Promise<string> {
  // Delete any existing sessions for this client
  await db.clientSession.deleteMany({
    where: { clientId }
  })

  // Create new session with token
  const sessionToken = await generateToken(
    await db.projectClient.findUniqueOrThrow({
      where: { id: clientId }
    })
  )

  await db.clientSession.create({
    data: {
      clientId,
      sessionToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  })

  return sessionToken
}

// Set client cookie
export async function setClientCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('client-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

// Get current client from cookies
export async function getCurrentClient(): Promise<ClientUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('client-token')?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Verify session exists and is valid
    const session = await db.clientSession.findFirst({
      where: {
        sessionToken: token,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        client: {
          include: {
            project: {
              include: {
                user: {
                  include: {
                    companyRelation: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!session) {
      return null
    }

    return {
      id: session.client.id,
      email: session.client.email,
      firstName: session.client.firstName,
      lastName: session.client.lastName,
      projectId: session.client.projectId,
      companyId: session.client.project.user.companyRelation?.id
    }
  } catch (error) {
    console.error('Error getting current client:', error)
    return null
  }
}

// Client login
export async function clientLogin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const client = await db.projectClient.findFirst({
      where: { 
        email: email.toLowerCase(),
        passwordHash: { not: null }
      }
    })

    if (!client || !client.passwordHash) {
      return { success: false, error: 'Invalid email or password' }
    }

    const isValid = await verifyPassword(password, client.passwordHash)
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Update last login
    await db.projectClient.update({
      where: { id: client.id },
      data: { lastLoginAt: new Date() }
    })

    const token = await createClientSession(client.id)
    await setClientCookie(token)

    return { success: true, token }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An error occurred during login' }
  }
}

// Client logout
export async function clientLogout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('client-token')?.value

  if (token) {
    // Delete session from database
    await db.clientSession.deleteMany({
      where: { sessionToken: token }
    })

    // Delete cookie
    cookieStore.delete('client-token')
  }
}

// Set client password (for first-time setup or reset)
export async function setClientPassword(clientId: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await hashPassword(password)
    
    await db.projectClient.update({
      where: { id: clientId },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error setting password:', error)
    return { success: false, error: 'Failed to set password' }
  }
}

// Validate password reset token
export async function validatePasswordResetToken(token: string): Promise<ProjectClient | null> {
  try {
    const client = await db.projectClient.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    return client
  } catch (error) {
    console.error('Error validating reset token:', error)
    return null
  }
}

// Request password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await db.projectClient.findFirst({
      where: { email: email.toLowerCase() }
    })

    if (!client) {
      // Don't reveal if email exists
      return { success: true }
    }

    // Generate reset token
    const { generatePasswordResetToken } = await import('@/lib/auth/client-tokens')
    const resetToken = await generatePasswordResetToken(client.id)

    // Send reset email
    const { sendPasswordResetEmail } = await import('@/lib/services/notifications')
    const project = await db.project.findUnique({
      where: { id: client.projectId },
      include: {
        user: {
          include: {
            companyRelation: true
          }
        }
      }
    })

    if (project) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/reset-password?token=${resetToken}`
      
      // This function would need to be added to notifications.ts
      // For now, we'll just log it
      console.log('Password reset URL:', resetUrl)
      
      // TODO: Implement sendPasswordResetEmail in notifications.ts
      // await sendPasswordResetEmail({
      //   client,
      //   project,
      //   company: project.user.companyRelation,
      //   resetUrl
      // })
    }

    return { success: true }
  } catch (error) {
    console.error('Error requesting password reset:', error)
    return { success: false, error: 'Failed to request password reset' }
  }
}