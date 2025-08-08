import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Camera, 
  Settings,
  Send,
  Eye,
  BarChart3 
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { publishReport } from "@/lib/actions/reports";
import { PhotoViewer } from "@/components/photo-viewer";
import { ProjectSettingsDialog } from "@/components/project-settings-dialog";
import { getAddressLine1, getAddressLine2 } from '@/lib/utils/address';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(projectId: string, userId: string) {
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: userId, // Ensure user owns this project
    },
    include: {
      reports: {
        orderBy: { createdAt: 'desc' },
        include: {
          photos: true,
        }
      },
      clients: true,
      // Removed the old photos query - we'll get them from published reports instead
      _count: {
        select: {
          reports: true,
          photos: true,
        }
      }
    }
  });

  return project;
}

// New function to get photos only from published reports
async function getPublishedReportPhotos(projectId: string, userId: string) {
  const publishedPhotos = await db.photo.findMany({
    where: {
      projectId: projectId,
      project: {
        userId: userId, // Ensure user owns the project
      },
      report: {
        isPublished: true, // Only photos from published reports
      }
    },
    orderBy: { uploadedAt: 'desc' },
    include: {
      report: {
        select: {
          id: true,
          title: true,
          weekNumber: true,
          year: true,
          publishedAt: true,
        }
      }
    }
  });

  return publishedPhotos;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { userId: clerkUserId } = await auth();
  
  if (!clerkUserId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect("/login");
  }

  // Ensure user exists in our database
  const dbUser = await ensureUserInDatabase(clerkUser);
  
  // Get the project
  const project = await getProject(id, dbUser.id);

  if (!project) {
    notFound();
  }

  // Get photos from published reports only
  const publishedPhotos = await getPublishedReportPhotos(id, dbUser.id);

  // Calculate some basic stats
  const latestReport = project.reports[0];
  const hasReports = project.reports.length > 0;

  // Server action for publishing reports
  async function handlePublishReport(reportId: string) {
    'use server'
    await publishReport(reportId);
    redirect(`/projects/${id}`);
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <div>
                      <span>{getAddressLine1(project)}</span>
                      {getAddressLine2(project) && (
                        <span className="text-gray-500">, {getAddressLine2(project)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Started {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'}
                  </div>
                  <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-gray-600 mt-2">{project.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Client Portal
                </Button>
                <Button asChild>
                  <Link href={`/projects/${id}/reports/new`}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </Link>
                </Button>
                <ProjectSettingsDialog project={project} />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project._count.reports}</div>
                <p className="text-xs text-muted-foreground">
                  {hasReports ? `Latest: ${latestReport?.createdAt ? new Date(latestReport.createdAt).toLocaleDateString() : 'N/A'}` : 'No reports yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Photos</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedPhotos.length}</div>
                <p className="text-xs text-muted-foreground">From published reports</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{project.clients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {project.clients.length === 0 ? 'None invited yet' : 'With portal access'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {project.status === 'ACTIVE' ? '🏗️' : project.status === 'COMPLETED' ? '✅' : '⏸️'}
                </div>
                <p className="text-xs text-muted-foreground">{project.status.toLowerCase()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="reports" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Weekly Reports</CardTitle>
                    <CardDescription>
                      {hasReports 
                        ? `${project._count.reports} report${project._count.reports > 1 ? 's' : ''} created for this project`
                        : 'Create your first weekly report for this project'
                      }
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href={`/projects/${id}/reports/new`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Report
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {hasReports ? (
                    <div className="space-y-4">
                      {project.reports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{report.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Week {report.weekNumber}, {report.year}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Created {new Date(report.createdAt).toLocaleDateString()}
                                {report.publishedAt && ` • Published ${new Date(report.publishedAt).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={report.isPublished ? 'default' : 'secondary'}>
                                {report.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${id}/reports/${report.id}`}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                              {!report.isPublished ? (
                                <form action={handlePublishReport.bind(null, report.id)} className="inline">
                                  <Button size="sm" type="submit">
                                    <Send className="w-3 h-3 mr-1" />
                                    Publish
                                  </Button>
                                </form>
                              ) : (
                                <Button size="sm" variant="outline">
                                  <Send className="w-3 h-3 mr-1" />
                                  Resend
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No reports yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create your first weekly report to start updating your clients.
                      </p>
                      <div className="mt-6">
                        <Button asChild>
                          <Link href={`/projects/${id}/reports/new`}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Report
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Photos</CardTitle>
                  <CardDescription>
                    Photos from published reports ({publishedPhotos.length} photos)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {publishedPhotos.length > 0 ? (
                    <PhotoViewer photos={publishedPhotos} />
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No photos from published reports</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Photos will appear here once you publish reports that contain photos.
                      </p>
                      <div className="mt-6">
                        <Button asChild>
                          <Link href={`/projects/${id}/reports/new`}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Report with Photos
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Project Clients</CardTitle>
                    <CardDescription>
                      Manage who has access to this project's portal
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Client
                  </Button>
                </CardHeader>
                <CardContent>
                  {project.clients.length > 0 ? (
                    <div className="space-y-4">
                      {project.clients.map((client) => (
                        <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{client.firstName} {client.lastName}</h3>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            <p className="text-xs text-gray-500">
                              Invited {new Date(client.invitedAt).toLocaleDateString()}
                              {client.lastViewedAt && ` • Last viewed ${new Date(client.lastViewedAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Portal Link
                            </Button>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients invited</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Invite your clients to give them access to the project portal.
                      </p>
                      <div className="mt-6">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Invite Your First Client
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Settings</CardTitle>
                  <CardDescription>
                    Manage project details and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Project Management</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Edit project details, update status, or delete this project.
                      </p>
                      <ProjectSettingsDialog 
                        project={project} 
                        trigger={
                          <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Project Details
                          </Button>
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Current Project Status</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {project.status === 'ACTIVE' && 'Project is currently under construction'}
                          {project.status === 'COMPLETED' && 'Project has been completed'}
                          {project.status === 'ON_HOLD' && 'Project is temporarily paused'}
                          {project.status === 'CANCELLED' && 'Project has been cancelled'}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Project Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</div>
                        <div><strong>Last Updated:</strong> {new Date(project.updatedAt).toLocaleDateString()}</div>
                        <div><strong>Total Reports:</strong> {project._count.reports}</div>
                        <div><strong>Total Photos:</strong> {project._count.photos}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}