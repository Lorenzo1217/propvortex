import { redirect } from 'next/navigation'
import { getCurrentClient } from '@/lib/auth/client-auth'
import { db } from '@/lib/db'
import ClientHeader from '@/components/client-header'
import PropVortexFooter from '@/components/propvortex-footer'
import { BrandProvider } from '@/components/providers/brand-provider'

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const client = await getCurrentClient()
  
  if (!client) {
    redirect('/client/login')
  }

  // Get company branding
  const project = await db.project.findUnique({
    where: { id: client.projectId },
    include: {
      user: {
        include: {
          companyRelation: true
        }
      }
    }
  })

  const company = project?.user.companyRelation

  return (
    <BrandProvider company={company || null} isClient={true}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ClientHeader client={client} company={company} />
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        <PropVortexFooter />
      </div>
    </BrandProvider>
  )
}