import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { ensureUserInDatabase } from '@/lib/user-helpers'

export async function CompanySetupCheck() {
  const clerkUser = await currentUser()
  if (!clerkUser) {
    redirect('/login')
  }
  
  const user = await ensureUserInDatabase(clerkUser)
  
  // If user doesn't have a company and is not on the setup page, redirect to setup
  if (!user.companyId) {
    redirect('/company/setup')
  }
  
  return null
}