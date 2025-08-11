import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Calendar, Users, BarChart3, MapPin } from "lucide-react";
import { getUserProjects } from '@/lib/user-helpers';
import { NewProjectDialog } from '@/components/new-project-dialog';
import Link from "next/link";
import { formatProjectAddress } from '@/lib/utils/address';
import { requireSubscription } from '@/lib/subscription';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect("/login");
  }

  // Ensure user exists in our database and check subscription
  const dbUser = await requireSubscription();
  
  // Get user's projects
  const projects = await getUserProjects(dbUser.id);

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const totalReports = projects.reduce((sum, p) => sum + p._count.reports, 0);
  const totalClients = projects.reduce((sum, p) => sum + p.clients.length, 0);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide">
            Welcome back, {clerkUser?.firstName || "Builder"}
          </h1>
          <p className="text-gray-500 mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-light text-gray-600">Active Projects</CardTitle>
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{activeProjects}</div>
              <p className="text-xs text-gray-500 mt-1">
                {activeProjects === 0 ? "Start your first project" : "Currently building"}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-light text-gray-600">Reports Sent</CardTitle>
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalReports}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
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
              <div className="text-2xl font-semibold">{totalClients}</div>
              <p className="text-xs text-gray-500 mt-1">Invited to portals</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-light text-gray-600">This Week</CardTitle>
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <p className="text-xs text-gray-500 mt-1">Reports due</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          {/* White card for the header */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Your Projects</h2>
                  <p className="text-sm text-gray-500">
                    {projects.length === 0 
                      ? "Create your first project to start sending beautiful reports"
                      : `Manage your ${projects.length} project${projects.length > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
              <NewProjectDialog />
            </div>
          </div>
            {projects.length === 0 ? (
              // Empty State
              <div className="bg-white rounded-lg p-12 text-center shadow-sm">
                <Home className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first project and inviting your client.
                </p>
                <div className="mt-6">
                  <NewProjectDialog buttonText="Create Your First Project" />
                </div>
              </div>
            ) : (
              // Projects Grid
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-white border-0 shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                          <CardDescription className="text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {formatProjectAddress(project)}
                          </CardDescription>
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
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{project._count.reports} reports</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.clients.length} clients</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-gray-600" asChild>
                          <Link href={`/projects/${project.id}`}>
                            View Project
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 bg-gray-900 hover:bg-gray-800">
                          Client Portal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}