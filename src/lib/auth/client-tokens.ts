import crypto from 'crypto'
import { db } from '@/lib/db'

export async function generatePasswordResetToken(clientId: string) {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  // Delete any existing tokens for this client
  await db.clientSession.deleteMany({
    where: {
      clientId,
      expiresAt: {
        lt: new Date() // Also clean up expired tokens
      }
    }
  })
  
  // Store token in ClientSession table
  const session = await db.clientSession.create({
    data: {
      clientId,
      token,
      expiresAt: expires,
    }
  })
  
  return token
}

export async function validatePasswordResetToken(token: string) {
  const session = await db.clientSession.findUnique({
    where: { token },
    include: { client: true }
  })
  
  if (!session) return null
  
  // Check if token is expired
  if (session.expiresAt < new Date()) {
    await db.clientSession.delete({ where: { id: session.id } })
    return null
  }
  
  return session.client
}

export async function consumePasswordResetToken(token: string) {
  const client = await validatePasswordResetToken(token)
  
  if (client) {
    // Delete the token after it's been used
    await db.clientSession.deleteMany({
      where: {
        token
      }
    })
  }
  
  return client
}

export async function generateClientPortalUrl(projectId: string, token?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  if (token) {
    return `${baseUrl}/client/portal/${projectId}?token=${token}`
  }
  
  return `${baseUrl}/client/portal/${projectId}`
}

export async function generatePasswordSetupUrl(projectId: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/client/setup-password?token=${token}&project=${projectId}`
}