import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  FileText, 
  Share,
  Download,
  Send,
  Edit,
  Eye,
  ZoomIn
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { publishReport } from "@/lib/actions/reports";
import { PhotoViewer } from "@/components/photo-viewer";
import { WeatherForecast } from "@/components/weather-forecast";
import { formatProjectAddress } from "@/lib/utils/address";
import { 
  WorkDisplay, 
  IssuesDisplay, 
  BudgetDisplay, 
  ClientActionsDisplay 
} from '@/components/report-sections/display/report-display'

interface PageProps {
  params: Promise<{
    id: string;
    reportId: string;
  }>;
}

async function getReportWithProject(reportId: string, userId: string) {
  const report = await db.report.findFirst({
    where: {
      id: reportId,
      project: {
        userId: userId, // Ensure user owns the project
      }
    },
    include: {
      project: true,
      photos: {
        orderBy: { uploadedAt: 'desc' }
      }
    }
  });

  return report;
}

// Component to safely render HTML content
function HTMLContent({ content, className = '' }: { content: string; className?: string }) {
  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default async function ReportViewPage({ params }: PageProps) {
  const { id, reportId } = await params;
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
  
  // Get the report
  const report = await getReportWithProject(reportId, dbUser.id);

  if (!report) {
    notFound();
  }

  // Server action for publishing the report
  async function handlePublishReport() {
    'use server'
    await publishReport(reportId);
    redirect(`/projects/${id}/reports/${reportId}`);
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href={`/projects/${id}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Project
            </Link>
          </div>

          {/* Report Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {report.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Week {report.weekNumber}, {report.year}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.project.name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant={report.isPublished ? 'default' : 'secondary'}>
                    {report.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                {report.publishedAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    Published on {new Date(report.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <Button variant="outline" asChild>
                  <Link href={`/projects/${id}/reports/${reportId}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Report
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-8">
            <Button variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            {!report.isPublished ? (
              <form action={handlePublishReport} className="inline">
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Publish Report
                </Button>
              </form>
            ) : (
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Client View
              </Button>
            )}
          </div>

          {/* Weather Forecast - NEW SECTION */}
          {report.weatherData && (
            <div className="mb-8">
              <WeatherForecast 
                weatherData={JSON.parse(report.weatherData as string)}
                projectLocation={formatProjectAddress(report.project)}
                isEditing={false}
              />
            </div>
          )}

          {/* Report Photos - Read Only with Lightbox */}
          {report.photos.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📸 Project Photos</span>
                  <Badge variant="outline" className="flex items-center">
                    <ZoomIn className="w-3 h-3 mr-1" />
                    Click to expand
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Photos included in this week's report • Click any photo to view full size with descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhotoViewer photos={report.photos} />
              </CardContent>
            </Card>
          )}

          {/* Report Content */}
          <div className="space-y-6">
            {/* Executive Summary */}
            {report.executiveSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <HTMLContent 
                    content={report.executiveSummary}
                    className="text-gray-700"
                  />
                </CardContent>
              </Card>
            )}

            {/* Work Completed - UPDATED with backward compatibility */}
            {report.workCompleted && (
              (() => {
                try {
                  // Try to parse as JSON
                  const items = JSON.parse(report.workCompleted as string);
                  return <WorkDisplay title="Work Completed This Week" items={items} />;
                } catch {
                  // If parsing fails, it's HTML content from old reports
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Completed This Week</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HTMLContent 
                          content={report.workCompleted as string}
                          className="text-gray-700"
                        />
                      </CardContent>
                    </Card>
                  );
                }
              })()
            )}

            {/* Upcoming Work - UPDATED with backward compatibility */}
            {report.upcomingWork && (
              (() => {
                try {
                  const items = JSON.parse(report.upcomingWork as string);
                  return <WorkDisplay title="Upcoming Work" items={items} />;
                } catch {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Work</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HTMLContent 
                          content={report.upcomingWork as string}
                          className="text-gray-700"
                        />
                      </CardContent>
                    </Card>
                  );
                }
              })()
            )}

            {/* Issues & Delays - UPDATED with backward compatibility */}
            {report.issues && (
              (() => {
                try {
                  const items = JSON.parse(report.issues as string);
                  return <IssuesDisplay items={items} />;
                } catch {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Issues & Delays</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HTMLContent 
                          content={report.issues as string}
                          className="text-gray-700"
                        />
                      </CardContent>
                    </Card>
                  );
                }
              })()
            )}

            {/* Budget Updates - UPDATED with backward compatibility */}
            {report.budget && (
              (() => {
                try {
                  const items = JSON.parse(report.budget as string);
                  return <BudgetDisplay items={items} />;
                } catch {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Budget & Change Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HTMLContent 
                          content={report.budget as string}
                          className="text-gray-700"
                        />
                      </CardContent>
                    </Card>
                  );
                }
              })()
            )}

            {/* Client Actions - UPDATED with backward compatibility */}
            {report.clientActions && (
              (() => {
                try {
                  const items = JSON.parse(report.clientActions as string);
                  return <ClientActionsDisplay items={items} />;
                } catch {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle>Client Actions Needed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HTMLContent 
                          content={report.clientActions as string}
                          className="text-gray-700"
                        />
                      </CardContent>
                    </Card>
                  );
                }
              })()
            )}
          </div>


        </div>
    </div>
  );
}