import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file || !projectId || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'propvortex-documents',
          public_id: `${projectId}_${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}`,
          format: file.name.split('.').pop(),
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const result = uploadResponse as any

    // Save to database with custom title
    const document = await db.document.create({
      data: {
        name: title,  // Use the custom title, not filename
        description: description || null,
        type: 'file',
        url: result.secure_url,
        mimeType: file.type,
        size: file.size,
        projectId: projectId,
      }
    })

    return NextResponse.json({ 
      success: true,
      document: {
        id: document.id,
        name: document.name,
        url: document.url
      }
    })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}