import PropVortexFooter from '@/components/propvortex-footer'
import { BrandProvider } from '@/components/providers/brand-provider'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No authentication required - public access for portal pages
  // Company branding will be loaded per-project in individual pages
  
  return (
    <BrandProvider company={null} isClient={true}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple header for public portal - no client-specific info */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold">Project Portal</h1>
              </div>
              <Link 
                href="/client/portal" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Portal Home
              </Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        <PropVortexFooter />
      </div>
    </BrandProvider>
  )
}