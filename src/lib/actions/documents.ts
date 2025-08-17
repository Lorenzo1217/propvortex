'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createDocumentLink(formData: FormData, projectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const url = formData.get('url') as string
  const description = formData.get('description') as string | null

  // Verify the user owns this project
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      user: {
        clerkId: userId
      }
    }
  })

  if (!project) {
    throw new Error('Project not found')
  }

  await db.document.create({
    data: {
      name,
      description,
      type: 'link',
      url,
      projectId,
    }
  })

  revalidatePath(`/projects/${projectId}`)
}

export async function deleteDocument(documentId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // Verify the user owns this document's project
  const document = await db.document.findFirst({
    where: {
      id: documentId,
      project: {
        user: {
          clerkId: userId
        }
      }
    }
  })

  if (!document) {
    throw new Error('Document not found')
  }

  await db.document.delete({
    where: { id: documentId }
  })

  revalidatePath('/projects')
}