import { NextResponse } from 'next/server'
import { validatePasswordResetToken } from '@/lib/auth/client-auth'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    const client = await validatePasswordResetToken(token)
    
    if (client) {
      return NextResponse.json({ 
        valid: true,
        client: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email
        }
      })
    } else {
      return NextResponse.json({ valid: false })
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}