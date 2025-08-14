import { redirect } from 'next/navigation'
import { getCurrentClient } from '@/lib/auth/client-auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Building2, Calendar, FileText, Image, MapPin, Clock, CheckCircle } from 'lucide-react'

export default async function ClientDashboard() {
  const client = await getCurrentClient()
  
  if (!client) {
    redirect('/client/login')
  }

  // Get project with latest reports and photos
  const project = await db.project.findUnique({
    where: { id: client.projectId },
    include: {
      reports: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          weekNumber: true,
          year: true,
          publishedAt: true,
          executiveSummary: true
        }
      },
      photos: {
        orderBy: { uploadedAt: 'desc' },
        take: 6,
        select: {
          id: true,
          url: true,
          tags: true
        }
      },
      _count: {
        select: {
          reports: {
            where: { isPublished: true }
          },
          photos: true
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
    return <div>Project not found</div>
  }

  const company = project.user.companyRelation
  const accentColor = company?.accentColor || '#3B82F6'

  // Get the latest report for quick stats
  const latestReport = project.reports[0]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {client.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's the latest on your {project.name} project
        </p>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" style={{ color: accentColor }} />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {project.address}
                </div>
                {project.city && project.state && (
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    {project.city}, {project.state} {project.zipCode}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Started {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: accentColor }}>
                    {project._count.reports}
                  </p>
                  <p className="text-sm text-gray-600">Reports Published</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: accentColor }}>
                    {project._count.photos}
                  </p>
                  <p className="text-sm text-gray-600">Photos Uploaded</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href={`/client/portal/${project.id}`}>
              <Button 
                className="w-full"
                style={{ backgroundColor: accentColor }}
              >
                View Full Project Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Latest Report */}
      {latestReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                Latest Report
              </CardTitle>
              <Badge variant="secondary">
                Week {latestReport.weekNumber}, {latestReport.year}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{latestReport.title}</h3>
            {latestReport.executiveSummary && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {latestReport.executiveSummary}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                Published {latestReport.publishedAt && new Date(latestReport.publishedAt).toLocaleDateString()}
              </div>
              <Link href={`/client/portal/${project.id}/reports/${latestReport.id}`}>
                <Button variant="outline" size="sm">
                  Read Full Report
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      {project.reports.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Your latest project updates and progress reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.reports.slice(1).map((report) => (
                <Link
                  key={report.id}
                  href={`/client/portal/${project.id}/reports/${report.id}`}
                  className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-500">
                        Week {report.weekNumber}, {report.year}
                      </p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/client/portal/${project.id}/reports`}>
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Photos */}
      {project.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="mr-2 h-5 w-5" style={{ color: accentColor }} />
              Recent Photos
            </CardTitle>
            <CardDescription>
              Latest progress photos from your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.photos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/client/portal/${project.id}/photos`}
                  className="aspect-square rounded-lg overflow-hidden border hover:opacity-90 transition-opacity"
                >
                  <img
                    src={photo.url}
                    alt="Project photo"
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/client/portal/${project.id}/photos`}>
                <Button variant="outline" className="w-full">
                  View All Photos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}