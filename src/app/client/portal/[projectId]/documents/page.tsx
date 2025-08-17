import { db } from '@/lib/db'
import { FileText, Link as LinkIcon, Download, ExternalLink, Home, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

export default async function ClientPortalDocumentsPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        include: {
          companyRelation: true
        }
      },
      documents: {
        orderBy: { uploadedAt: 'desc' }
      },
      _count: {
        select: {
          documents: true
        }
      }
    }
  })

  if (!project) {
    return notFound()
  }

  const company = project.user.companyRelation
  const primaryColor = company?.primaryColor || '#000000'
  const secondaryColor = company?.secondaryColor || '#666666'
  const accentColor = company?.accentColor || '#3B82F6'

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 space-y-6">
        {/* Project Header - Match main portal style */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <div 
            className="border-b px-8 py-6"
            style={{
              background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
              borderBottomColor: secondaryColor
            }}
          >
            {/* Company Branding */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {company?.logoUrl ? (
                  <img 
                    src={company.logoUrl} 
                    alt={company?.name || 'Builder'}
                    className="h-12 w-auto max-w-[200px]"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-10 w-10" style={{ color: primaryColor }} />
                    <span className="text-xl font-semibold" style={{ color: primaryColor }}>
                      {company?.name || 'Your Builder'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Link 
                  href={`/client/portal/${projectId}`}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm border"
                  style={{ borderColor: secondaryColor }}
                  title="Portal Home"
                >
                  <Home 
                    className="h-5 w-5" 
                    style={{ color: primaryColor }}
                  />
                </Link>
                <Badge variant="secondary">
                  {project._count.documents} Documents
                </Badge>
              </div>
            </div>
            
            {/* Project Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name} - Documents
              </h1>
              <p className="text-gray-600">
                Important documents and resources for your project
              </p>
            </div>
          </div>
        </Card>

        {/* Documents Grid */}
        {project.documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.documents.map((doc) => (
              <Card 
                key={doc.id} 
                className="bg-white border-0 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                <CardHeader 
                  className="pb-3"
                  style={{
                    background: `linear-gradient(to bottom, ${primaryColor}05, transparent)`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        {doc.type === 'file' ? (
                          <FileText className="h-5 w-5" style={{ color: accentColor }} />
                        ) : (
                          <LinkIcon className="h-5 w-5" style={{ color: accentColor }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-medium text-gray-900 truncate">
                          {doc.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                  
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {doc.type === 'file' ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Document
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </>
                    )}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardContent className="py-16 text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <FileText className="h-10 w-10" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Documents will appear here when your builder uploads them for your review.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}