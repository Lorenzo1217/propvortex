import { NextResponse } from 'next/server'
import { validatePasswordResetToken, setClientPassword, createClientSession, setClientCookie } from '@/lib/auth/client-auth'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Validate token and get client
    const client = await validatePasswordResetToken(token)
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Set the password
    const result = await setClientPassword(client.id, password)
    
    if (result.success) {
      // Optionally auto-login after password setup
      // const sessionToken = await createClientSession(client.id)
      // await setClientCookie(sessionToken)
      
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Setup password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}