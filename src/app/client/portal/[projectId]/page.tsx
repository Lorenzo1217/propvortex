import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Building2, Calendar, FileText, Image, MapPin, 
  Clock, TrendingUp, DollarSign, AlertCircle,
  CheckCircle2, Users, Eye, Cloud, Camera,
  ArrowRight, Home, BarChart3, Sparkles,
  ChevronRight, ZoomIn
} from 'lucide-react'
import { WeatherForecast } from '@/components/weather-forecast'
import { PhotoViewer } from '@/components/photo-viewer'

export default async function ClientProjectPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  
  // No authentication required - anyone with the link can view
  // Get project with detailed information
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      reports: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          weekNumber: true,
          year: true,
          publishedAt: true,
          executiveSummary: true,
          budget: true,
          issues: true,
          clientActions: true
        }
      },
      photos: {
        orderBy: { uploadedAt: 'desc' },
        select: {
          id: true,
          url: true,
          tags: true,
          uploadedAt: true
        }
      },
      clients: {
        select: {
          firstName: true,
          lastName: true,
          relationshipType: true
        }
      },
      user: {
        include: {
          companyRelation: true
        }
      },
      _count: {
        select: {
          reports: {
            where: { isPublished: true }
          },
          photos: true
        }
      }
    }
  })

  if (!project) {
    return notFound()
  }

  const company = project.user.companyRelation
  const accentColor = company?.accentColor || '#3B82F6'
  
  // Get latest report for current status
  const latestReport = project.reports[0]
  
  // Parse budget info from latest report
  let budgetInfo = null
  if (latestReport?.budget) {
    try {
      budgetInfo = JSON.parse(latestReport.budget as string)
    } catch (e) {
      console.error('Failed to parse budget:', e)
    }
  }

  // Parse issues from latest report
  let activeIssues = []
  if (latestReport?.issues) {
    try {
      const issues = JSON.parse(latestReport.issues as string)
      activeIssues = issues.filter((issue: any) => !issue.resolved)
    } catch (e) {
      console.error('Failed to parse issues:', e)
    }
  }

  // Parse client actions from latest report
  let clientActions = []
  if (latestReport?.clientActions) {
    try {
      clientActions = JSON.parse(latestReport.clientActions as string)
    } catch (e) {
      console.error('Failed to parse client actions:', e)
    }
  }

  // Calculate project stats
  const projectDuration = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const weeksActive = Math.floor(projectDuration / 7)
  
  // Get recent photos (last 6)
  const recentPhotos = project.photos.slice(0, 6)

  return (
    <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 space-y-6">
        {/* Project Header - Match report header style */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
            {/* Company Branding */}
            <div className="flex items-center justify-between mb-6">
              {company?.logoUrl ? (
                <img 
                  src={company.logoUrl} 
                  alt={company?.name || 'Builder'}
                  className="h-12 w-auto max-w-[200px]"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Building2 className="h-10 w-10 text-gray-800" />
                  <span className="text-xl font-semibold text-gray-900">
                    {company?.name || 'Your Builder'}
                  </span>
                </div>
              )}
              <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {project.status === 'ACTIVE' ? 'Active Project' : project.status}
              </Badge>
            </div>
            
            {/* Project Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.address}
                  {project.city && `, ${project.city}, ${project.state} ${project.zipCode}`}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Started {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Bar - Match report action buttons style */}
          <CardContent className="px-8 py-4">
            <div className="flex flex-wrap gap-3">
              {latestReport && (
                <Link href={`/client/portal/${projectId}/reports/${latestReport.id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    View Latest Report
                  </Button>
                </Link>
              )}
              <Link href={`/client/portal/${projectId}/reports`}>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  All Reports
                </Button>
              </Link>
              <Link href={`/client/portal/${projectId}/photos`}>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Photos
                </Button>
              </Link>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Project Stats Cards - Match dashboard style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Project Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeksActive} weeks</div>
              <p className="text-xs text-muted-foreground">
                {projectDuration} days active
              </p>
              {budgetInfo?.percentComplete && (
                <Progress value={parseInt(budgetInfo.percentComplete)} className="mt-2 h-2" />
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Days Active</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectDuration}</div>
              <p className="text-xs text-muted-foreground">
                Since {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reports Published</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project._count.reports}</div>
              <p className="text-xs text-muted-foreground">
                {latestReport ? `Week ${latestReport.weekNumber} latest` : 'No reports yet'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project._count.photos}</div>
              <p className="text-xs text-muted-foreground">
                Progress documentation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Report Section - Match report view style */}
        {latestReport && (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Latest Report Summary
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Week {latestReport.weekNumber}, {latestReport.year} • Published {latestReport.publishedAt && new Date(latestReport.publishedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Link href={`/client/portal/${projectId}/reports/${latestReport.id}`}>
                  <Button variant="outline" size="sm">
                    View Full Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              {latestReport.executiveSummary && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{latestReport.executiveSummary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Photos Section - Match report photo gallery style */}
        {recentPhotos.length > 0 && (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Recent Progress Photos
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {project._count.photos} photos documenting your project
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border-0">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Click to view</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <div className="grid grid-cols-3 gap-3">
                {recentPhotos.map((photo) => (
                  <div key={photo.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden hover:bg-gray-200 transition-colors cursor-pointer">
                    <img 
                      src={photo.url} 
                      alt="Progress photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href={`/client/portal/${projectId}/photos`}>
                  <Button variant="outline">
                    View All {project._count.photos} Photos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Client Actions Required - Match report style */}
        {clientActions.length > 0 && (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                    Client Actions Required
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{clientActions.length} Pending</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <div className="space-y-5">
                {clientActions.map((action: any, index: number) => (
                  <div key={index} className="group">
                    <div className="rounded-lg border bg-white border-gray-200 hover:border-gray-300 hover:shadow-md p-5 transition-all duration-200">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <p className="leading-relaxed text-gray-700">
                            {action.action}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <div className="p-1 bg-gray-100 rounded">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-sm font-light">Action Required</span>
                            </div>
                            {action.dueDate && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Due {new Date(action.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {action.priority === 'high' ? (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 text-white">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                              <span className="text-xs font-medium tracking-wide text-white">Urgent</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                              <span className="text-xs font-medium tracking-wide text-gray-700">Standard</span>
                            </div>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Team Section - Match dashboard style */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                  Project Team
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Your project contacts and team members
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 py-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company?.name || 'Your Builder'}</p>
                    <p className="text-sm text-gray-600">Project Manager</p>
                  </div>
                </div>
                <Badge className="bg-gray-800 text-white">Builder</Badge>
              </div>
              {project.clients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.firstName} {client.lastName}</p>
                      <p className="text-sm text-gray-600">{client.relationshipType}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{client.relationshipType}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}