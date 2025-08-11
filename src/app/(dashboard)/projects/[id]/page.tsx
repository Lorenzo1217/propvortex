import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-2">
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
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === 'ACTIVE' ? 'bg-green-500' : 
                      project.status === 'COMPLETED' ? 'bg-gray-400' :
                      project.status === 'ON_HOLD' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {project.status === 'ACTIVE' ? 'Active' : 
                       project.status === 'COMPLETED' ? 'Completed' :
                       project.status === 'ON_HOLD' ? 'On Hold' :
                       'Cancelled'}
                    </span>
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-600 mt-2">{project.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="text-gray-600">
                  <Eye className="w-4 h-4 mr-2" />
                  Client Portal
                </Button>
                <ProjectSettingsDialog project={project} />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-light text-gray-600">Total Reports</CardTitle>
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{project._count.reports}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {hasReports ? `Latest: ${latestReport?.createdAt ? new Date(latestReport.createdAt).toLocaleDateString() : 'N/A'}` : 'No reports yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-light text-gray-600">Photos</CardTitle>
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Camera className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{publishedPhotos.length}</div>
                <p className="text-xs text-gray-500 mt-1">From published reports</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-light text-gray-600">Clients</CardTitle>
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{project.clients.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {project.clients.length === 0 ? 'None invited yet' : 'With portal access'}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-light text-gray-600">Status</CardTitle>
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'ACTIVE' ? 'bg-green-500' : 
                    project.status === 'COMPLETED' ? 'bg-gray-400' :
                    project.status === 'ON_HOLD' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-xl font-semibold text-gray-800">
                    {project.status === 'ACTIVE' ? 'Active' : 
                     project.status === 'COMPLETED' ? 'Completed' :
                     project.status === 'ON_HOLD' ? 'On Hold' :
                     'Cancelled'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{project.status.toLowerCase()}</p>
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
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {/* Section header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-medium text-gray-900">Weekly Reports</h2>
                        <p className="text-sm text-gray-500">
                          {hasReports 
                            ? `${project._count.reports} report${project._count.reports > 1 ? 's' : ''} created for this project`
                            : 'Create your first weekly report for this project'
                          }
                        </p>
                      </div>
                    </div>
                    <Button className="bg-gray-900 hover:bg-gray-800" asChild>
                      <Link href={`/projects/${id}/reports/new`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Report
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Reports list - INSIDE the white card */}
                  {hasReports ? (
                    <div className="space-y-3">
                      {project.reports.map((report) => (
                        <div key={report.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                              {report.isPublished ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-sm font-medium text-gray-700">Published</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                  <span className="text-sm font-medium text-gray-700">Draft</span>
                                </div>
                              )}
                              <Button variant="outline" size="sm" className="text-gray-600" asChild>
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
                                <Button size="sm" variant="outline" className="text-gray-600">
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-light text-gray-900">Project Photos</CardTitle>
                      <CardDescription className="mt-1">
                        Photos from published reports ({publishedPhotos.length} photos)
                      </CardDescription>
                    </div>
                  </div>
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
              <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-light text-gray-900">Project Clients</CardTitle>
                        <CardDescription className="mt-1">
                          Manage who has access to this project's portal
                        </CardDescription>
                      </div>
                    </div>
                    <Button className="bg-gray-900 hover:bg-gray-800">
                      <Plus className="w-4 h-4 mr-2" />
                      Invite Client
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {project.clients.length > 0 ? (
                    <div className="space-y-4">
                      {project.clients.map((client) => (
                        <div key={client.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{client.firstName} {client.lastName}</h3>
                              <p className="text-sm text-gray-600">{client.email}</p>
                              <p className="text-xs text-gray-500">
                                Invited {new Date(client.invitedAt).toLocaleDateString()}
                                {client.lastViewedAt && ` • Last viewed ${new Date(client.lastViewedAt).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-gray-600">
                                Portal Link
                              </Button>
                              <Button variant="outline" size="sm" className="text-gray-600">
                                Remove
                              </Button>
                            </div>
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
              <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-light text-gray-900">Project Settings</CardTitle>
                      <CardDescription className="mt-1">
                        Manage project details and configuration
                      </CardDescription>
                    </div>
                  </div>
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
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            project.status === 'ACTIVE' ? 'bg-green-500' : 
                            project.status === 'COMPLETED' ? 'bg-gray-400' :
                            project.status === 'ON_HOLD' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            {project.status === 'ACTIVE' ? 'Active' : 
                             project.status === 'COMPLETED' ? 'Completed' :
                             project.status === 'ON_HOLD' ? 'On Hold' :
                             'Cancelled'}
                          </span>
                        </div>
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