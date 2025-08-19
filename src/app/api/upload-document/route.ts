import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// IMPORTANT: This is the correct way to set limits in App Router
export const maxDuration = 60 // 60 seconds timeout for large files
export const dynamic = 'force-dynamic'

// Configure route segment to handle large payloads
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the form data - Next.js handles the size internally
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

    // For large files, use Cloudinary's upload_large method
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use upload_stream for files with chunking support
    const uploadResponse = await new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'propvortex-documents',
          chunk_size: 6000000, // 6MB chunks for large files
          timeout: 120000, // 2 minute timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
      upload_stream.end(buffer)
    })

    const result = uploadResponse as any

    // Save to database with custom title
    const document = await db.document.create({
      data: {
        name: title,
        description: description || null,
        type: 'file',
        url: result.secure_url,
        mimeType: file.type,
        size: file.size,
        projectId: projectId,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Upload error:', error)
    
    // More specific error messages
    if (error.message?.includes('413')) {
      return NextResponse.json(
        { error: 'File too large. Please contact support for files over 50MB.' },
        { status: 413 }
      )
    }
    
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}