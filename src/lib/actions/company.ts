'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ensureUserInDatabase } from '@/lib/user-helpers'

export async function createCompany(formData: FormData) {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) throw new Error('Not authenticated')
  
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('User not found')
  
  const dbUser = await ensureUserInDatabase(clerkUser)
  if (dbUser.companyId) throw new Error('Company already exists')
  
  const name = formData.get('name') as string
  const logoUrl = formData.get('logoUrl') as string
  const primaryColor = formData.get('primaryColor') as string
  const secondaryColor = formData.get('secondaryColor') as string
  const accentColor = formData.get('accentColor') as string
  
  const company = await db.company.create({
    data: {
      name,
      logoUrl: logoUrl || null,
      primaryColor,
      secondaryColor,
      accentColor,
    }
  })
  
  await db.user.update({
    where: { id: dbUser.id },
    data: { companyId: company.id }
  })
  
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateCompany(formData: FormData) {
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('Not authenticated')
  
  const dbUser = await ensureUserInDatabase(clerkUser)
  if (!dbUser.companyId) throw new Error('No company found')
  
  const name = formData.get('name') as string
  const logoUrl = formData.get('logoUrl') as string
  const primaryColor = formData.get('primaryColor') as string
  const secondaryColor = formData.get('secondaryColor') as string
  const accentColor = formData.get('accentColor') as string
  
  await db.company.update({
    where: { id: dbUser.companyId },
    data: {
      name,
      logoUrl: logoUrl || null,
      primaryColor,
      secondaryColor,
      accentColor,
    }
  })
  
  revalidatePath('/company/settings')
  revalidatePath('/dashboard')
}

export async function getCompanyBranding(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { companyRelation: true }
  })
  return user?.companyRelation || null
}

export async function getCurrentUserCompany() {
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return null
  
  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    include: { companyRelation: true }
  })
  
  return user?.companyRelation || null
}

export async function deleteCompanyLogo() {
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error('Not authenticated')
  
  const dbUser = await ensureUserInDatabase(clerkUser)
  if (!dbUser.companyId) throw new Error('No company found')
  
  await db.company.update({
    where: { id: dbUser.companyId },
    data: { logoUrl: null }
  })
  
  revalidatePath('/company/settings')
}