import { UserButton } from "@clerk/nextjs";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Home, Calendar, Users, BarChart3, MapPin, Clock } from "lucide-react";
import { ensureUserInDatabase, getUserProjects } from '@/lib/user-helpers';
import { NewProjectDialog } from '@/components/new-project-dialog';
import Link from "next/link";
import { formatProjectAddress } from '@/lib/utils/address';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/login");
  }

  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect("/login");
  }

  // Ensure user exists in our database
  const dbUser = await ensureUserInDatabase(clerkUser);
  
  // Get user's projects
  const projects = await getUserProjects(dbUser.id);

  // Calculate stats
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const totalReports = projects.reduce((sum, p) => sum + p._count.reports, 0);
  const totalClients = projects.reduce((sum, p) => sum + p.clients.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="/logo1.svg" 
                  alt="PropVortex Logo" 
                  className="w-8 h-8 rounded"
                  width={32}
                  height={32}
                />
                <span className="font-bold text-xl">PropVortex</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</span>
                <span className="text-gray-600 hover:text-gray-900 transition-colors">Projects</span>
                <span className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <NewProjectDialog />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {clerkUser?.firstName || "Builder"}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {activeProjects === 0 ? "Start your first project" : "Currently building"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Sent</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-muted-foreground">Invited to portals</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Reports due</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>
                  {projects.length === 0 
                    ? "Create your first project to start sending beautiful reports to your clients."
                    : `Manage your ${projects.length} project${projects.length > 1 ? 's' : ''}`
                  }
                </CardDescription>
              </div>
              <NewProjectDialog />
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                // Empty State
                <div className="text-center py-12">
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
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {formatProjectAddress(project)}
                            </div>
                          </div>
                          <Badge variant={project.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {project._count.reports} reports
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {project.clients.length} clients
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Updated {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/projects/${project.id}`}>
                              View Project
                            </Link>
                          </Button>
                          <Button size="sm" className="flex-1">
                            Client Portal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}