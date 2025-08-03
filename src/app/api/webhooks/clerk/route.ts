// src/app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log('📧 Clerk webhook received:', type)

    if (type === 'user.created') {
      // Create user in our database when they sign up
      const user = await db.user.create({
        data: {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
        },
      })

      console.log('✅ User created in database:', user.email)
    }

    if (type === 'user.updated') {
      // Update user in our database when they update their profile
      await db.user.update({
        where: { clerkId: data.id },
        data: {
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
        },
      })

      console.log('✅ User updated in database:', data.email_addresses[0]?.email_address)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}