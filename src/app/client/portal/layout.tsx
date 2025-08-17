import PropVortexFooter from '@/components/propvortex-footer'
import { BrandProvider } from '@/components/providers/brand-provider'

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
        {/* No generic header - each page has its own branded header */}
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        <PropVortexFooter />
      </div>
    </BrandProvider>
  )
}