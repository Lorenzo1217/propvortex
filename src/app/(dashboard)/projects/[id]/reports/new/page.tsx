// src/app/(dashboard)/projects/[id]/reports/new/page.tsx
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { 
  ArrowLeft,
  FileText,
  Calendar,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ensureUserInDatabase } from "@/lib/user-helpers";
import { createReport } from "@/lib/actions/reports";
import { formatProjectAddress } from "@/lib/utils/address";
import { ReportFormClient } from '@/components/report-form-client'

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

  // Server action to import data from previous report
  async function importFromPreviousReport() {
    'use server';
    
    // Get the most recent report for this project
    const previousReport = await db.report.findFirst({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
      }
    });
    
    if (!previousReport) {
      // No previous report found - redirect without params
      redirect(`/projects/${id}/reports/new?nodata=true`);
    }
    
    // Redirect to the same page with query params containing the data
    const searchParams = new URLSearchParams();
    searchParams.set('imported', 'true');
    
    // Add report data to URL params (for simpler fields)
    if (previousReport.executiveSummary) searchParams.set('executiveSummary', String(previousReport.executiveSummary));
    if (previousReport.workCompleted) searchParams.set('workCompleted', String(previousReport.workCompleted));
    if (previousReport.upcomingWork) searchParams.set('upcomingWork', String(previousReport.upcomingWork));
    if (previousReport.issues) searchParams.set('issues', String(previousReport.issues));
    if (previousReport.budget) searchParams.set('budget', String(previousReport.budget));
    if (previousReport.clientActions) searchParams.set('clientActions', String(previousReport.clientActions));
    
    // For Control Estimate fields
    if (previousReport.ceProfessionalFees) searchParams.set('ceProfessionalFees', previousReport.ceProfessionalFees);
    if (previousReport.ceConstructionCosts) searchParams.set('ceConstructionCosts', previousReport.ceConstructionCosts);
    if (previousReport.ceOffsiteUtilities) searchParams.set('ceOffsiteUtilities', previousReport.ceOffsiteUtilities);
    if (previousReport.ceFFE) searchParams.set('ceFFE', previousReport.ceFFE);
    if (previousReport.ceInsuranceFinancing) searchParams.set('ceInsuranceFinancing', previousReport.ceInsuranceFinancing);
    if (previousReport.ceTotal) searchParams.set('ceTotal', previousReport.ceTotal);
    if (previousReport.ceContingency) searchParams.set('ceContingency', previousReport.ceContingency);
    if (previousReport.ceContingencyUsed) searchParams.set('ceContingencyUsed', previousReport.ceContingencyUsed);
    
    redirect(`/projects/${id}/reports/new?${searchParams.toString()}`);
  }

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

          {/* Client Component Form */}
          <ReportFormClient
            projectId={id}
            projectName={project.name}
            weekNumber={weekNumber}
            year={year}
            reportCount={project._count.reports + 1}
            projectAddress={formatProjectAddress(project)}
            handleCreateReport={handleCreateReport}
            importFromPreviousReport={importFromPreviousReport}
          />
        </div>
    </div>
  );
}