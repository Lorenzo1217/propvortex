import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { ensureUserInDatabase } from '@/lib/user-helpers'
import { CompanySetupForm } from './company-setup-form'

export default async function CompanySetupPage() {
  const clerkUser = await currentUser()
  if (!clerkUser) {
    redirect('/login')
  }
  
  const user = await ensureUserInDatabase(clerkUser)
  
  // If user already has a company, redirect to dashboard
  if (user.companyId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to PropVortex! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Let's set up your company branding. This will personalize your client reports and make your projects stand out.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Company Setup</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Create Project</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-semibold">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Build Reports</span>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <CompanySetupForm />

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            You can always update these settings later in your Company Settings
          </p>
        </div>
      </div>
    </div>
  )
}