import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Save, 
  Sparkles,
  FileText,
  Calendar,
  MapPin,
  Edit,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Cloud
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { updateReport, refreshWeatherData } from "@/lib/actions/reports";
import { PhotoUpload } from "@/components/photo-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { WeatherForecast } from "@/components/weather-forecast";
import { formatProjectAddress } from "@/lib/utils/address";
import { WorkItems } from '@/components/report-sections/work-items'
import { IssuesDelays } from '@/components/report-sections/issues-delays'
import { BudgetChangeOrders } from '@/components/report-sections/budget-change-orders'
import { ClientActions } from '@/components/report-sections/client-actions'
import { ControlEstimate } from '@/components/report-sections/control-estimate'

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
      project: {
        include: {
          _count: {
            select: {
              reports: true,
            }
          }
        }
      },
      photos: {
        orderBy: { uploadedAt: 'desc' }
      }
    }
  });

  return report;
}

export default async function EditReportPage({ params }: PageProps) {
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
  
  // Get the report and project
  const report = await getReportWithProject(reportId, dbUser.id);

  if (!report) {
    notFound();
  }

  // Create a server action with the report ID bound
  async function handleUpdateReport(formData: FormData) {
    'use server'
    const result = await updateReport(formData, reportId);
    if (result.success) {
      redirect(`/projects/${id}/reports/${reportId}`);
    }
  }

  // Create a refresh weather action
  async function handleRefreshWeather() {
    'use server'
    await refreshWeatherData(reportId)
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href={`/projects/${id}/reports/${reportId}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Report
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">
              Edit Weekly Report
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 mt-2">
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
                Created {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Update your weekly progress report for {report.project.name}
            </p>
          </div>

          {/* Report Form */}
          <form id="report-form" action={handleUpdateReport} className="space-y-8">
            {/* Report Title */}
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Report Details
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Update the basic information about this report
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 py-6 space-y-4">
                <div>
                  <Label htmlFor="title">Report Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={report.title}
                    required
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weather Forecast Section - MOVED UP ABOVE PHOTOS */}
            {report.weatherData && (
              <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Cloud className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Weather Outlook
                      </CardTitle>
                      <CardDescription className="mt-1">
                        7-day forecast for construction planning • Weather conditions as of report creation
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6">
                  <WeatherForecast 
                    weatherData={JSON.parse(report.weatherData as string)}
                    projectLocation={formatProjectAddress(report.project)}
                    onRefresh={handleRefreshWeather}
                    isEditing={true}
                  />
                </CardContent>
              </Card>
            )}

            {/* Photo Upload Section */}
            <PhotoUpload 
              projectId={id} 
              reportId={reportId}
              existingPhotos={report.photos.map(photo => ({
                id: photo.id,
                url: photo.url,
                originalName: photo.originalName,
                caption: photo.caption || ''
              }))}
            />

            {/* Executive Summary */}
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FileText className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Executive Summary
                      </CardTitle>
                      <CardDescription className="mt-1">
                        High-level overview of this week's progress and key highlights
                      </CardDescription>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="text-gray-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Enhance
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-8 py-6">
                <RichTextEditor
                  name="executiveSummary"
                  content={report.executiveSummary || ''}
                  placeholder="Provide a brief overview of the week's progress, major milestones achieved, and overall project status..."
                />
              </CardContent>
            </Card>

            {/* Work Completed - UPDATED */}
            <WorkItems
              name="workCompleted"
              title="Work Completed This Week"
              description="List specific tasks, installations, and milestones completed"
              placeholder="e.g., Completed foundation pour for garage addition"
              showImpact={true}
              items={report.workCompleted ? JSON.parse(report.workCompleted as string) : []}
            />

            {/* Upcoming Work - UPDATED */}
            <WorkItems
              name="upcomingWork"
              title="Upcoming Work"
              description="Planned activities and milestones for next week"
              placeholder="e.g., Begin framing of second floor"
              showImpact={true}
              items={report.upcomingWork ? JSON.parse(report.upcomingWork as string) : []}
            />

            {/* Issues & Delays - UPDATED */}
            <IssuesDelays
              name="issues"
              items={report.issues ? JSON.parse(report.issues as string) : []}
            />

            {/* Budget & Change Orders - UPDATED */}
            <BudgetChangeOrders
              name="budget"
              items={report.budget ? JSON.parse(report.budget as string) : []}
            />

            {/* Control Estimate Update */}
            <ControlEstimate 
              isEditing={true}
              initialData={{
                professionalFees: report?.ceProfessionalFees || '',
                constructionCosts: report?.ceConstructionCosts || '',
                offsiteUtilities: report?.ceOffsiteUtilities || '',
                ffe: report?.ceFFE || '',
                insuranceFinancing: report?.ceInsuranceFinancing || '',
                total: report?.ceTotal || '',
                contingency: report?.ceContingency || '',
                contingencyUsed: report?.ceContingencyUsed || ''
              }}
            />

            {/* Client Actions - UPDATED */}
            <ClientActions
              name="clientActions"
              items={report.clientActions ? JSON.parse(report.clientActions as string) : []}
            />

            {/* Fixed Action Buttons - Only One Button Now */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" asChild>
                <Link href={`/projects/${id}/reports/${reportId}`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                <Save className="w-4 h-4 mr-2" />
                Update Report
              </Button>
            </div>
          </form>
        </div>
    </div>
  );
}