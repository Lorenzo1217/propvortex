import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Building2, Calendar, FileText, MapPin, 
  Clock, TrendingUp,
  CheckCircle2, Users, Eye, Camera,
  ArrowRight, ChevronRight
} from 'lucide-react'

// Component to safely render HTML content
function HTMLContent({ content, className = '' }: { content: string; className?: string }) {
  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

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
  
  // Get brand colors from company settings
  const primaryColor = company?.primaryColor || '#000000'
  const secondaryColor = company?.secondaryColor || '#666666'
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

  // Get client actions from latest report - it's an HTML string, not JSON
  const clientActionsHTML = latestReport?.clientActions ? String(latestReport.clientActions) : null

  // Calculate project stats
  const projectDuration = Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const weeksActive = Math.floor(projectDuration / 7)
  
  // Removed photos section as requested

  return (
    <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 space-y-6">
        {/* Project Header - Match report header style */}
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
                  <Button 
                    className="text-white hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
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
            <CardHeader 
              className="border-b px-8 py-6"
              style={{
                background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
                borderBottomColor: secondaryColor
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
                    <FileText className="w-5 h-5" style={{ color: accentColor }} />
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
                <HTMLContent 
                  content={String(latestReport.executiveSummary)}
                  className="text-gray-700 leading-relaxed prose prose-gray max-w-none"
                />
              )}
            </CardContent>
          </Card>
        )}


        {/* Client Actions Required - Display HTML content from latest report */}
        {clientActionsHTML && (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader 
              className="border-b px-8 py-6"
              style={{
                background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
                borderBottomColor: secondaryColor
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
                    <Users className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                    Client Actions Required
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">From Week {latestReport?.weekNumber || 'Latest'}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <HTMLContent 
                content={clientActionsHTML}
                className="text-gray-700 leading-relaxed prose prose-gray max-w-none"
              />
            </CardContent>
          </Card>
        )}

        {/* Project Team Section - Match dashboard style */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <CardHeader 
            className="border-b px-8 py-6"
            style={{
              background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
              borderBottomColor: secondaryColor
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
                <Users className="w-5 h-5" style={{ color: accentColor }} />
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company?.name || 'Your Builder'}</p>
                    <p className="text-sm text-gray-600">Project Manager</p>
                  </div>
                </div>
                <Badge className="text-white" style={{ backgroundColor: primaryColor }}>Builder</Badge>
              </div>
              {project.clients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
                      <Users className="w-5 h-5" style={{ color: accentColor }} />
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