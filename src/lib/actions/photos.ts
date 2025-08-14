// src/lib/actions/photos.ts
'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { stringifyTags, parseTags } from '@/config/photo-tags'

export async function savePhotoToProject(
  projectId: string,
  fileUrl: string,
  fileName: string,
  fileSize: number,
  mimeType: string,
  caption?: string,
  reportId?: string,
  tags?: string[]
) {
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

  // Verify user owns the project
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: dbUser.id
    }
  })

  if (!project) {
    throw new Error('Project not found or access denied')
  }

  try {
    // Create the photo record
    const photo = await db.photo.create({
      data: {
        filename: generateFilename(fileName),
        originalName: fileName,
        mimeType,
        size: fileSize,
        url: fileUrl,
        caption: caption || null,
        tags: tags ? stringifyTags(tags) : null,
        projectId,
        reportId: reportId || null,
      }
    })

    console.log('✅ Photo saved:', photo.originalName)

    // Revalidate relevant pages
    revalidatePath(`/projects/${projectId}`)
    if (reportId) {
      revalidatePath(`/projects/${projectId}/reports/${reportId}`)
    }
    
    return { success: true, photo }
  } catch (error) {
    console.error('❌ Error saving photo:', error)
    throw error
  }
}

export async function deletePhoto(photoId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the photo and verify ownership
    const photo = await db.photo.findFirst({
      where: {
        id: photoId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      },
      include: {
        project: true
      }
    })

    if (!photo) {
      throw new Error('Photo not found or access denied')
    }

    // Delete the photo record
    await db.photo.delete({
      where: { id: photoId }
    })

    console.log('✅ Photo deleted:', photo.originalName)

    // Revalidate relevant pages
    revalidatePath(`/projects/${photo.projectId}`)
    if (photo.reportId) {
      revalidatePath(`/projects/${photo.projectId}/reports/${photo.reportId}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting photo:', error)
    throw error
  }
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the photo and verify ownership
    const photo = await db.photo.findFirst({
      where: {
        id: photoId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      }
    })

    if (!photo) {
      throw new Error('Photo not found or access denied')
    }

    // Update the caption
    const updatedPhoto = await db.photo.update({
      where: { id: photoId },
      data: { caption: caption || null }
    })

    console.log('✅ Photo caption updated:', updatedPhoto.originalName)

    // Revalidate relevant pages
    revalidatePath(`/projects/${photo.projectId}`)
    if (photo.reportId) {
      revalidatePath(`/projects/${photo.projectId}/reports/${photo.reportId}`)
    }
    
    return { success: true, photo: updatedPhoto }
  } catch (error) {
    console.error('❌ Error updating photo caption:', error)
    throw error
  }
}

export async function updatePhotoTags(photoId: string, tags: string[]) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the photo and verify ownership
    const photo = await db.photo.findFirst({
      where: {
        id: photoId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      }
    })

    if (!photo) {
      throw new Error('Photo not found or access denied')
    }

    // Update the tags
    const updatedPhoto = await db.photo.update({
      where: { id: photoId },
      data: { tags: tags.length > 0 ? stringifyTags(tags) : null }
    })

    console.log('✅ Photo tags updated:', updatedPhoto.originalName)

    // Revalidate relevant pages
    revalidatePath(`/projects/${photo.projectId}`)
    if (photo.reportId) {
      revalidatePath(`/projects/${photo.projectId}/reports/${photo.reportId}`)
    }
    
    return { success: true, photo: updatedPhoto }
  } catch (error) {
    console.error('❌ Error updating photo tags:', error)
    throw error
  }
}

export async function updatePhotoCaptionAndTags(
  photoId: string, 
  caption: string, 
  tags: string[]
) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the photo and verify ownership
    const photo = await db.photo.findFirst({
      where: {
        id: photoId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      }
    })

    if (!photo) {
      throw new Error('Photo not found or access denied')
    }

    // Update both caption and tags
    const updatedPhoto = await db.photo.update({
      where: { id: photoId },
      data: { 
        caption: caption || null,
        tags: tags.length > 0 ? stringifyTags(tags) : null
      }
    })

    console.log('✅ Photo caption and tags updated:', updatedPhoto.originalName)

    // Revalidate relevant pages
    revalidatePath(`/projects/${photo.projectId}`)
    if (photo.reportId) {
      revalidatePath(`/projects/${photo.projectId}/reports/${photo.reportId}`)
    }
    
    return { success: true, photo: updatedPhoto }
  } catch (error) {
    console.error('❌ Error updating photo:', error)
    throw error
  }
}

export async function searchPhotosByTags(projectId: string, tags: string[]) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the database user
    const dbUser = await db.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!dbUser) {
      throw new Error('User not found in database')
    }

    // Verify user owns the project
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: dbUser.id
      }
    })

    if (!project) {
      throw new Error('Project not found or access denied')
    }

    // Get all photos for the project
    const photos = await db.photo.findMany({
      where: {
        projectId,
        report: {
          isPublished: true // Only from published reports
        }
      },
      orderBy: { uploadedAt: 'desc' },
      include: {
        report: {
          select: {
            id: true,
            title: true,
            weekNumber: true,
            year: true,
            publishedAt: true,
          }
        }
      }
    })

    // Filter photos by tags if provided
    if (tags.length === 0) {
      return photos
    }

    const filteredPhotos = photos.filter(photo => {
      const photoTags = parseTags(photo.tags)
      // Check if photo has at least one of the search tags
      return tags.some(searchTag => photoTags.includes(searchTag))
    })

    return filteredPhotos
  } catch (error) {
    console.error('❌ Error searching photos by tags:', error)
    throw error
  }
}

// Helper function to generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${randomId}.${extension}`
}