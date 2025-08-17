import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, ArrowLeft, Image, ChevronRight, Building2, Eye, Home } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function ReportsListPage({ 
  params 
}: { 
  params: Promise<{ projectId: string }> 
}) {
  const { projectId } = await params
  
  // No authentication required - public access
  // Load project with published reports
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      reports: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        include: {
          photos: {
            select: { id: true }
          },
          _count: {
            select: { photos: true }
          }
        }
      },
      user: {
        include: {
          companyRelation: true
        }
      }
    }
  })
  
  if (!project) {
    return notFound()
  }

  const company = project.user.companyRelation
  
  // Get brand colors from company settings
  const primaryColor = company?.primaryColor || '#000000'
  const secondaryColor = company?.secondaryColor || '#666666'
  const accentColor = company?.accentColor || '#3B82F6'
  
  return (
    <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
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
                  {project.reports.length} Reports Published
                </Badge>
              </div>
            </div>
            
            {/* Project Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name} - All Reports
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  All Weekly Progress Reports
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {project.reports.length} Total Reports
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Bar */}
          <CardContent className="px-8 py-4">
            <div className="flex flex-wrap gap-3">
              <Link href={`/client/portal/${projectId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </Button>
              </Link>
              {project.reports[0] && (
                <Link href={`/client/portal/${projectId}/reports/${project.reports[0].id}`}>
                  <Button 
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Latest Report
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {project.reports.length === 0 ? (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-lg">No reports published yet</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for updates</p>
              </CardContent>
            </Card>
          ) : (
            project.reports.map((report) => {
              // Parse executive summary if it's a JSON string
              let summary = ''
              if (report.executiveSummary) {
                try {
                  summary = typeof report.executiveSummary === 'string' 
                    ? report.executiveSummary 
                    : JSON.parse(report.executiveSummary as string)
                } catch (e) {
                  summary = report.executiveSummary as string
                }
              }

              // Strip HTML tags from summary for preview
              const cleanSummary = summary.replace(/<[^>]*>/g, '')

              return (
                <Link 
                  key={report.id}
                  href={`/client/portal/${projectId}/reports/${report.id}`}
                  className="block group"
                >
                  <Card 
                    className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-white border shadow-lg shadow-gray-100/50"
                    style={{ borderColor: secondaryColor }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          className="text-xs px-2 py-1"
                          style={{ 
                            backgroundColor: `${primaryColor}20`,
                            color: primaryColor,
                            borderColor: primaryColor
                          }}
                          variant="outline"
                        >
                          Week {report.weekNumber}, {report.year}
                        </Badge>
                        {report._count.photos > 0 && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Image className="h-3 w-3" />
                            {report._count.photos}
                          </span>
                        )}
                      </div>
                      <CardTitle 
                        className="line-clamp-2 transition-colors"
                      >
                        {report.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {report.publishedAt ? (
                          <>
                            {new Date(report.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            <span className="text-gray-400">•</span>
                            <span>{formatDistanceToNow(new Date(report.publishedAt), { addSuffix: true })}</span>
                          </>
                        ) : (
                          <>
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            <span className="text-gray-400">•</span>
                            <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    {cleanSummary && (
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {cleanSummary}
                        </p>
                        <div 
                          className="mt-3 flex items-center text-sm font-medium group-hover:gap-2 transition-all"
                          style={{ color: primaryColor }}
                        >
                          View Report 
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}