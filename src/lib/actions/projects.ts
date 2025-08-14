'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ensureUserInDatabase } from '@/lib/user-helpers'
import { ClientRelationship } from '@prisma/client'

export async function checkCanCreateProject() {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    return { canCreate: false, message: 'Not authenticated' }
  }

  try {
    // Get the database user with project count
    const dbUser = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: {
        projectLimit: true,
        _count: {
          select: {
            projects: true
          }
        }
      }
    })

    if (!dbUser) {
      return { canCreate: false, message: 'User not found' }
    }

    // If projectLimit is null, it means unlimited projects
    if (dbUser.projectLimit === null) {
      return { canCreate: true }
    }

    // Check if user is under their limit
    const canCreate = dbUser._count.projects < dbUser.projectLimit
    
    return {
      canCreate,
      message: canCreate ? undefined : "You've reached your project limit. Upgrade to create more projects."
    }
  } catch (error) {
    console.error('Error checking project limit:', error)
    return { canCreate: false, message: 'Failed to check project limit' }
  }
}

export async function createProject(formData: FormData) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  // Get the database user
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  // Extract form data
  const name = formData.get('name') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zipCode = formData.get('zipCode') as string
  const description = formData.get('description') as string
  const startDate = formData.get('startDate') as string

  // Extract optional client data
  const addClient = formData.get('addClient') === 'true'
  const clientFirstName = formData.get('clientFirstName') as string
  const clientLastName = formData.get('clientLastName') as string
  const clientEmail = formData.get('clientEmail') as string
  const clientPhone = formData.get('clientPhone') as string
  const clientRelationshipType = formData.get('clientRelationshipType') as ClientRelationship

  // Create full address for backward compatibility
  const fullAddress = `${street}, ${city}, ${state} ${zipCode}`.trim()

  // Validate required fields
  if (!name || !street || !city || !state || !zipCode) {
    throw new Error('Please fill in all required fields')
  }

  // Validate client data if adding client
  if (addClient && (!clientFirstName || !clientLastName || !clientEmail)) {
    throw new Error('Please fill in all required client fields')
  }

  try {
    // Use a transaction to ensure both project and client are created or neither
    const result = await db.$transaction(async (tx) => {
      // Create the project
      const project = await tx.project.create({
        data: {
          name,
          address: fullAddress,  // Keep for backward compatibility
          street,
          city,
          state,
          zipCode,
          description: description || null,
          startDate: startDate ? new Date(startDate) : null,
          userId: dbUser.id,
          status: 'ACTIVE'
        }
      })

      // Create initial client if provided
      let client = null
      if (addClient && clientEmail) {
        client = await tx.projectClient.create({
          data: {
            projectId: project.id,
            email: clientEmail,
            firstName: clientFirstName,
            lastName: clientLastName,
            phone: clientPhone || null,
            relationshipType: clientRelationshipType || 'HOMEOWNER',
            isInvited: false,
            invitedAt: new Date(),
          }
        })
      }

      return { project, client }
    })

    console.log('✅ Project created:', result.project.name)
    if (result.client) {
      console.log('✅ Initial client added:', result.client.email)
    }

    // Revalidate the dashboard to show the new project
    revalidatePath('/dashboard')
    
    return { success: true, project: result.project }
  } catch (error) {
    console.error('❌ Error creating project:', error)
    throw new Error('Failed to create project')
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  // Get the database user
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  // Verify project ownership
  const existingProject = await db.project.findFirst({
    where: {
      id: projectId,
      userId: dbUser.id
    }
  })

  if (!existingProject) {
    throw new Error('Project not found or access denied')
  }

  // Extract form data
  const name = formData.get('name') as string
  const street = formData.get('street') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const zipCode = formData.get('zipCode') as string
  const description = formData.get('description') as string
  const startDate = formData.get('startDate') as string
  const status = formData.get('status') as 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'

  // Create full address for backward compatibility
  const fullAddress = `${street}, ${city}, ${state} ${zipCode}`.trim()

  // Validate required fields
  if (!name || !street || !city || !state || !zipCode) {
    throw new Error('Please fill in all required fields')
  }

  // Validate status
  const validStatuses = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']
  if (status && !validStatuses.includes(status)) {
    throw new Error('Invalid project status')
  }

  try {
    // Update the project
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        name,
        address: fullAddress,  // Keep for backward compatibility
        street,
        city,
        state,
        zipCode,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        status: status || 'ACTIVE',
        updatedAt: new Date()
      }
    })

    console.log('✅ Project updated:', updatedProject.name)

    // Revalidate relevant pages
    revalidatePath('/dashboard')
    revalidatePath(`/projects/${projectId}`)
    
    return { success: true, project: updatedProject }
  } catch (error) {
    console.error('❌ Error updating project:', error)
    throw new Error('Failed to update project')
  }
}

export async function deleteProject(projectId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  // Get the database user
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  // Verify project ownership
  const existingProject = await db.project.findFirst({
    where: {
      id: projectId,
      userId: dbUser.id
    }
  })

  if (!existingProject) {
    throw new Error('Project not found or access denied')
  }

  try {
    // Delete the project (this will cascade delete reports, photos, and clients)
    await db.project.delete({
      where: { id: projectId }
    })

    console.log('✅ Project deleted:', existingProject.name)

    // Revalidate the dashboard
    revalidatePath('/dashboard')
    
    // Redirect to dashboard after deletion
    redirect('/dashboard')
  } catch (error) {
    console.error('❌ Error deleting project:', error)
    throw new Error('Failed to delete project')
  }
}

// Client Management Functions
export async function addClientToProject(projectId: string, formData: FormData) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error('Not authenticated')
  
  const dbUser = await ensureUserInDatabase()
  
  // Verify user owns the project
  const project = await db.project.findFirst({
    where: { id: projectId, userId: dbUser.id }
  })
  if (!project) throw new Error('Project not found or access denied')
  
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const relationshipType = formData.get('relationshipType') as ClientRelationship
  
  // Check if client already exists for this project
  const existingClient = await db.projectClient.findUnique({
    where: {
      projectId_email: {
        projectId,
        email
      }
    }
  })
  
  if (existingClient) {
    throw new Error('A client with this email already exists for this project')
  }
  
  const client = await db.projectClient.create({
    data: {
      projectId,
      email,
      firstName,
      lastName,
      phone: phone || null,
      relationshipType: relationshipType || 'HOMEOWNER',
      isInvited: false, // Will be set to true when first report is published
      invitedAt: new Date(),
    }
  })
  
  revalidatePath(`/projects/${projectId}`)
  return { success: true, client }
}

export async function getProjectClients(projectId: string) {
  const clients = await db.projectClient.findMany({
    where: { projectId },
    orderBy: { invitedAt: 'desc' }
  })
  return clients
}

export async function removeClientFromProject(projectId: string, clientId: string) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error('Not authenticated')
  
  const dbUser = await ensureUserInDatabase()
  
  // Verify user owns the project
  const project = await db.project.findFirst({
    where: { 
      id: projectId, 
      userId: dbUser.id,
      clients: {
        some: { id: clientId }
      }
    }
  })
  
  if (!project) throw new Error('Project or client not found, or access denied')
  
  await db.projectClient.delete({
    where: { id: clientId }
  })
  
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}