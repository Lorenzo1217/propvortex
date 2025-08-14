import { redirect } from 'next/navigation'
import { ensureUserInDatabase } from '@/lib/user-helpers'

export async function CompanySetupCheck() {
  const user = await ensureUserInDatabase()
  
  // If user doesn't have a company and is not on the setup page, redirect to setup
  if (!user.companyId) {
    redirect('/company/setup')
  }
  
  return null
}