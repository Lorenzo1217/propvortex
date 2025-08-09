// src/app/(dashboard)/projects/[id]/reports/new/page.tsx
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Sparkles,
  FileText,
  Calendar,
  MapPin,
  Cloud,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { createReport } from "@/lib/actions/reports";
import { PhotoUpload } from "@/components/photo-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { formatProjectAddress } from "@/lib/utils/address";
import { WorkItems } from '@/components/report-sections/work-items'
import { IssuesDelays } from '@/components/report-sections/issues-delays'
import { BudgetChangeOrders } from '@/components/report-sections/budget-change-orders'
import { ClientActions } from '@/components/report-sections/client-actions'
import { ControlEstimate } from '@/components/report-sections/control-estimate'

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProject(projectId: string, userId: string) {
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: userId,
    },
    include: {
      _count: {
        select: {
          reports: true,
        }
      }
    }
  });

  return project;
}

// Helper function to get current week info
function getCurrentWeekInfo() {
  const now = new Date();
  const year = now.getFullYear();
  
  // Calculate week number
  const d = new Date(Date.UTC(year, now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  
  return { weekNumber, year };
}

export default async function NewReportPage({ params }: PageProps) {
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

  const { weekNumber, year } = getCurrentWeekInfo();

  // Create a server action with the project ID bound
  async function handleCreateReport(formData: FormData) {
    'use server'
    const result = await createReport(formData, id);
    if (result.success) {
      redirect(`/projects/${id}`);
    }
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-wide">
              Create Weekly Report
            </h1>
            <div className="flex items-center space-x-4 text-gray-600 mt-2">
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Week {weekNumber}, {year}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {project.name}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Report #{project._count.reports + 1}
              </div>
            </div>
            <p className="text-gray-600 mt-2">
              Create your weekly progress report for {project.name}
            </p>
          </div>

          {/* Report Form */}
          <form id="report-form" action={handleCreateReport} className="space-y-8">
            {/* Report Title */}
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Report Details
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Basic information about this week's report
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
                    placeholder={`Week ${weekNumber} Progress Report - ${project.name}`}
                    defaultValue={`Week ${weekNumber} Progress Report - ${project.name}`}
                    required
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weather Forecast Section - UPDATED */}
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 rounded-lg">
                    <Cloud className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Weather Outlook
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Weather forecast will be automatically added when the report is created
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 py-6">
                <div className="text-center py-8 text-gray-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Cloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm">Weather data will be fetched based on project location: <strong className="text-gray-700">{formatProjectAddress(project)}</strong></p>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload Section */}
            <PhotoUpload projectId={id} />

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
            />

            {/* Upcoming Work - UPDATED */}
            <WorkItems
              name="upcomingWork"
              title="Upcoming Work"
              description="Planned activities and milestones for next week"
              placeholder="e.g., Begin framing of second floor"
              showImpact={true}
            />

            {/* Issues & Delays - UPDATED */}
            <IssuesDelays
              name="issues"
              items={[]}
            />

            {/* Budget & Change Orders - UPDATED */}
            <BudgetChangeOrders
              name="budget"
              items={[]}
            />

            {/* Control Estimate Update */}
            <ControlEstimate isEditing={true} />

            {/* Client Actions - UPDATED */}
            <ClientActions
              name="clientActions"
              items={[]}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" asChild>
                <Link href={`/projects/${id}`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white">
                <Send className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          </form>
        </div>
    </div>
  );
}