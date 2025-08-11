// src/lib/user-helpers.ts
import { db } from './db'
import { User } from '@clerk/nextjs/server'

export async function ensureUserInDatabase(clerkUser: User) {
  try {
    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    
    // Use upsert to handle both new and existing users
    const dbUser = await db.user.upsert({
      where: { 
        clerkId: clerkUser.id 
      },
      update: {
        // Update these fields if user exists
        email,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
      },
      create: {
        // Create with these fields if user doesn't exist
        clerkId: clerkUser.id,
        email,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
      }
    })

    console.log('✅ User ensured in database:', dbUser.email)
    return dbUser
  } catch (error) {
    console.error('❌ Error ensuring user in database:', error)
    
    // If upsert fails due to unique constraint on email, try to find by email
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        const existingUser = await db.user.findUnique({
          where: { email }
        });
        
        if (existingUser) {
          // Update the existing user with the new clerkId
          const updatedUser = await db.user.update({
            where: { email },
            data: {
              clerkId: clerkUser.id,
              firstName: clerkUser.firstName || existingUser.firstName,
              lastName: clerkUser.lastName || existingUser.lastName,
            }
          });
          console.log('✅ Updated existing user with new Clerk ID:', updatedUser.email);
          return updatedUser;
        }
      }
    }
    
    throw error
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await db.user.findUnique({
      where: { clerkId }
    });
    return user;
  } catch (error) {
    console.error('❌ Error fetching user by Clerk ID:', error);
    return null;
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
      }
    })

    // Custom sorting: Status priority (ACTIVE first) then by start date (newest first)
    // Use [...projects] to create a copy and avoid mutating the original array
    const sortedProjects = [...projects].sort((a, b) => {
      // Status priority: ACTIVE > ON_HOLD > COMPLETED > CANCELLED
      const statusOrder: Record<string, number> = { 
        'ACTIVE': 0, 
        'ON_HOLD': 1, 
        'COMPLETED': 2, 
        'CANCELLED': 3 
      };
      const statusCompare = (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999);
      
      if (statusCompare !== 0) return statusCompare;
      
      // If same status, sort by start date (newest first)
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
      return bDate - aDate;
    });

    return sortedProjects
  } catch (error) {
    console.error('❌ Error fetching user projects:', error)
    return []
  }
}