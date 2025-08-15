import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, ArrowLeft, Image, ChevronRight } from 'lucide-react'
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
  const accentColor = company?.accentColor || '#3B82F6'
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href={`/client/portal/${projectId}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Project Overview
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600">All Weekly Progress Reports</p>
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {project.reports.length} Total Reports
            </span>
            <span>{project.address}</span>
            {project.city && (
              <span>{project.city}, {project.state} {project.zipCode}</span>
            )}
          </div>
        </div>
      </div>
      
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

            return (
              <Link 
                key={report.id}
                href={`/client/portal/${projectId}/reports/${report.id}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-gray-200 hover:border-blue-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge 
                        className="text-xs px-2 py-1"
                        style={{ 
                          backgroundColor: `${accentColor}20`,
                          color: accentColor,
                          borderColor: accentColor
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
                    <CardTitle className="line-clamp-2 group-hover:text-blue-600 transition-colors">
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
                  {summary && (
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {summary}
                      </p>
                      <div className="mt-3 flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
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
      
      {/* Company Branding Footer */}
      {company && (
        <div className="mt-12 pt-8 border-t text-center">
          <div className="text-sm text-gray-500">
            <p>Project managed by</p>
            <p className="font-medium text-gray-700 mt-1">{company.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}