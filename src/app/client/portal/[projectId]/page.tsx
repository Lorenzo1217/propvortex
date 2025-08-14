import { redirect } from 'next/navigation'
import { getCurrentClient } from '@/lib/auth/client-auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { 
  Building2, Calendar, FileText, Image, MapPin, 
  Clock, TrendingUp, DollarSign, AlertCircle,
  CheckCircle2, Users
} from 'lucide-react'

export default async function ClientProjectPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const client = await getCurrentClient()
  
  if (!client || client.projectId !== projectId) {
    redirect('/client/login')
  }

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
    return <div>Project not found</div>
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

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="mr-2 h-4 w-4" />
              {project.address}
              {project.city && `, ${project.city}, ${project.state} ${project.zipCode}`}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Started {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FileText className="mr-1 h-4 w-4" />
                {project._count.reports} Reports
              </div>
              <div className="flex items-center">
                <Image className="mr-1 h-4 w-4" />
                {project._count.photos} Photos
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-lg px-3 py-1"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Active Project
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Latest Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: accentColor }}>
              {latestReport ? `Week ${latestReport.weekNumber}` : 'No reports'}
            </div>
            {latestReport?.publishedAt && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(latestReport.publishedAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Project Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: accentColor }}>
              {Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Since project start
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: activeIssues.length > 0 ? '#EF4444' : '#10B981' }}>
              {activeIssues.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activeIssues.length > 0 ? 'Requires attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: clientActions.length > 0 ? accentColor : '#10B981' }}>
              {clientActions.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {clientActions.length > 0 ? 'Pending actions' : 'None pending'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      {budgetInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" style={{ color: accentColor }} />
              Budget Overview
            </CardTitle>
            <CardDescription>
              Current project budget status and allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetInfo.percentComplete && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Project Completion</span>
                    <span className="font-medium">{budgetInfo.percentComplete}%</span>
                  </div>
                  <Progress value={parseInt(budgetInfo.percentComplete)} className="h-2" />
                </div>
              )}
              
              {budgetInfo.items && budgetInfo.items.length > 0 && (
                <div className="space-y-2 pt-2">
                  {budgetInfo.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-0">
                      <span className="text-sm">{item.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">{item.spent}</span>
                        {item.budget && (
                          <span className="text-xs text-gray-500 ml-1">/ {item.budget}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Issues */}
      {activeIssues.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Active Issues
            </CardTitle>
            <CardDescription>
              Items requiring attention or resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIssues.map((issue: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{issue.description}</p>
                    {issue.impact && (
                      <p className="text-sm text-gray-600 mt-1">Impact: {issue.impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Action Items */}
      {clientActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" style={{ color: accentColor }} />
              Your Action Items
            </CardTitle>
            <CardDescription>
              Items requiring your input or decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clientActions.map((action: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" style={{ color: accentColor }} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{action.action}</p>
                    {action.dueDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Due: {new Date(action.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" style={{ color: accentColor }} />
            Project Team
          </CardTitle>
          <CardDescription>
            People involved in your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Project Manager</p>
                <p className="text-sm text-gray-600">{company?.name || 'Your Builder'}</p>
              </div>
              <Badge variant="secondary">Builder</Badge>
            </div>
            {project.clients.map((projectClient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{projectClient.firstName} {projectClient.lastName}</p>
                  <p className="text-sm text-gray-600">{projectClient.relationshipType}</p>
                </div>
                <Badge variant="outline">{projectClient.relationshipType}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Link href={`/client/portal/${projectId}/reports`}>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View All Reports
            </Button>
          </Link>
          <Link href={`/client/portal/${projectId}/photos`}>
            <Button variant="outline" className="w-full">
              <Image className="mr-2 h-4 w-4" />
              View Photos
            </Button>
          </Link>
          {latestReport && (
            <Link href={`/client/portal/${projectId}/reports/${latestReport.id}`}>
              <Button 
                className="w-full"
                style={{ backgroundColor: accentColor }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Latest Report
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  )
}