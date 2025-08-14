import { redirect } from 'next/navigation'
import { ensureUserInDatabase } from '@/lib/user-helpers'
import { getCurrentUserCompany } from '@/lib/actions/company'
import { CompanySettingsForm } from './company-settings-form'

export default async function CompanySettingsPage() {
  const user = await ensureUserInDatabase()
  
  // If user doesn't have a company, redirect to setup
  if (!user.companyId) {
    redirect('/company/setup')
  }

  const company = await getCurrentUserCompany()
  if (!company) {
    redirect('/company/setup')
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your company branding and appearance settings
        </p>
      </div>

      {/* Settings Form */}
      <CompanySettingsForm company={company} />
    </div>
  )
}