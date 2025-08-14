import { NextResponse } from 'next/server'
import { clientLogout } from '@/lib/auth/client-auth'

export async function POST() {
  try {
    await clientLogout()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}