import { NextResponse } from 'next/server'
import { requestPasswordReset } from '@/lib/auth/client-auth'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await requestPasswordReset(email)
    
    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    // Still return success to prevent email enumeration
    return NextResponse.json({ success: true })
  }
}