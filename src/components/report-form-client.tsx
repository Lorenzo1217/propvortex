'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Send, 
  Sparkles,
  FileText,
  Cloud,
  CheckCircle,
  Copy
} from "lucide-react";
import Link from "next/link";
import { PhotoUpload } from "@/components/photo-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { WorkItems } from '@/components/report-sections/work-items'
import { IssuesDelays } from '@/components/report-sections/issues-delays'
import { BudgetChangeOrders } from '@/components/report-sections/budget-change-orders'
import { ClientActions } from '@/components/report-sections/client-actions'
import { ControlEstimate } from '@/components/report-sections/control-estimate'

interface ReportFormClientProps {
  projectId: string;
  weekNumber: number;
  projectAddress: string;
  handleCreateReport: (formData: FormData) => Promise<void>;
  importFromPreviousReport: () => Promise<void>;
}

export function ReportFormClient({
  projectId,
  weekNumber,
  projectAddress,
  handleCreateReport,
  importFromPreviousReport
}: ReportFormClientProps) {
  const searchParams = useSearchParams();
  const imported = searchParams.get('imported');
  const nodata = searchParams.get('nodata');

  return (
    <>
      {/* Import Button */}
      <div className="mb-6 flex justify-end">
        <form action={importFromPreviousReport}>
          <Button 
            type="submit"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Import data from previous report
          </Button>
        </form>
      </div>

      {/* Success/Info Messages */}
      {imported && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>Data imported from previous report. Review and update as needed.</span>
          </div>
        </div>
      )}
      
      {nodata && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <FileText className="w-5 h-5" />
            <span>No previous reports found to import data from.</span>
          </div>
        </div>
      )}

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
                placeholder={`Week ${weekNumber} Progress Report`}
                defaultValue={`Week ${weekNumber} Progress Report`}
                required
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Weather Forecast Section */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
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
              <p className="text-sm">Weather data will be fetched based on project location: <strong className="text-gray-700">{projectAddress}</strong></p>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Section */}
        <PhotoUpload projectId={projectId} />

        {/* Executive Summary */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
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
              content={searchParams.get('executiveSummary') || ''}
              placeholder="Provide a brief overview of the week's progress, major milestones achieved, and overall project status..."
            />
          </CardContent>
        </Card>

        {/* Work Completed */}
        <WorkItems
          name="workCompleted"
          title="Work Completed This Week"
          description="List specific tasks, installations, and milestones completed"
          placeholder="e.g., Completed foundation pour for garage addition"
          showImpact={true}
          items={searchParams.get('workCompleted') ? (() => {
            try {
              return JSON.parse(searchParams.get('workCompleted')!);
            } catch {
              return [];
            }
          })() : []}
        />

        {/* Upcoming Work */}
        <WorkItems
          name="upcomingWork"
          title="Upcoming Work"
          description="Planned activities and milestones for next week"
          placeholder="e.g., Begin framing of second floor"
          showImpact={true}
          items={searchParams.get('upcomingWork') ? (() => {
            try {
              return JSON.parse(searchParams.get('upcomingWork')!);
            } catch {
              return [];
            }
          })() : []}
        />

        {/* Issues & Delays */}
        <IssuesDelays
          name="issues"
          items={searchParams.get('issues') ? (() => {
            try {
              return JSON.parse(searchParams.get('issues')!);
            } catch {
              return [];
            }
          })() : []}
        />

        {/* Budget & Change Orders */}
        <BudgetChangeOrders
          name="budget"
          items={searchParams.get('budget') ? (() => {
            try {
              return JSON.parse(searchParams.get('budget')!);
            } catch {
              return [];
            }
          })() : []}
        />

        {/* Control Estimate Update */}
        <ControlEstimate 
          isEditing={true}
          initialData={
            searchParams.get('ceProfessionalFees') ? {
              professionalFees: searchParams.get('ceProfessionalFees') || '',
              constructionCosts: searchParams.get('ceConstructionCosts') || '',
              offsiteUtilities: searchParams.get('ceOffsiteUtilities') || '',
              ffe: searchParams.get('ceFFE') || '',
              insuranceFinancing: searchParams.get('ceInsuranceFinancing') || '',
              total: searchParams.get('ceTotal') || '',
              contingency: searchParams.get('ceContingency') || '',
              contingencyUsed: searchParams.get('ceContingencyUsed') || '',
            } : undefined
          }
        />

        {/* Client Actions */}
        <ClientActions
          name="clientActions"
          items={searchParams.get('clientActions') ? (() => {
            try {
              return JSON.parse(searchParams.get('clientActions')!);
            } catch {
              return [];
            }
          })() : []}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" asChild>
            <Link href={`/projects/${projectId}`}>
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
    </>
  );
}