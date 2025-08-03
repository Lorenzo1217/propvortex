// src/lib/user-helpers.ts
import { db } from './db'
import { User } from '@clerk/nextjs/server'

export async function ensureUserInDatabase(clerkUser: User) {
  try {
    // Try to find the user in our database
    let dbUser = await db.user.findUnique({
      where: { clerkId: clerkUser.id }
    })

    // If user doesn't exist, create them
    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
        }
      })
      console.log('✅ New user created in database:', dbUser.email)
    }

    return dbUser
  } catch (error) {
    console.error('❌ Error ensuring user in database:', error)
    throw error
  }
}

export async function getUserProjects(userId: string) {
  try {
    const projects = await db.project.findMany({
      where: { userId },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get the latest report
        },
        clients: true,
        _count: {
          select: {
            reports: true,
            photos: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return projects
  } catch (error) {
    console.error('❌ Error fetching user projects:', error)
    return []
  }
}