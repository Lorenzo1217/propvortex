'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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

  // Create full address for backward compatibility
  const fullAddress = `${street}, ${city}, ${state} ${zipCode}`.trim()

  // Validate required fields
  if (!name || !street || !city || !state || !zipCode) {
    throw new Error('Please fill in all required fields')
  }

  try {
    // Create the project
    const project = await db.project.create({
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

    console.log('✅ Project created:', project.name)

    // Revalidate the dashboard to show the new project
    revalidatePath('/dashboard')
    
    return { success: true, project }
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