'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, FileText, MapPin,
  Download, Home, Cloud, Camera, ZoomIn
} from 'lucide-react'
import { PhotoViewer } from '@/components/photo-viewer'
import { WeatherForecast } from '@/components/weather-forecast'
import { formatProjectAddress } from '@/lib/utils/address'
import { 
  WorkDisplay, 
  IssuesDisplay, 
  BudgetDisplay, 
  ClientActionsDisplay 
} from '@/components/report-sections/display/luxury-report-display'
import { ControlEstimate } from '@/components/report-sections/control-estimate'

interface ClientReportViewProps {
  report: any
  project: any
  company: any
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

export default function ClientReportView({ report, project, company }: ClientReportViewProps) {
  // Get brand colors for header/navigation only
  const primaryColor = company?.primaryColor || '#000000'
  const secondaryColor = company?.secondaryColor || '#666666'

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Back Navigation with Home Icon */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href={`/client/portal/${project.id}/reports`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All Reports
          </Link>
          <div className="flex items-center gap-2">
            <Link 
              href={`/client/portal/${project.id}`}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm border"
              style={{ borderColor: secondaryColor }}
              title="Portal Home"
            >
              <Home 
                className="h-5 w-5" 
                style={{ color: primaryColor }}
              />
            </Link>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Report Header - Exactly like builder's view */}
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
                  {project.name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : new Date(report.createdAt).toLocaleDateString()}
                </div>
                <Badge variant="default">
                  Published
                </Badge>
              </div>
              {report.publishedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  Published on {new Date(report.publishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Weather Outlook - Exactly like builder's view */}
        {report.weatherData && (
          <Card className="mb-8 bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
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
                    7-day forecast for construction planning • Weather conditions as of report creation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <WeatherForecast 
                weatherData={JSON.parse(report.weatherData as string)}
                projectLocation={formatProjectAddress(project)}
                isEditing={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Report Photos - Exactly like builder's view */}
        {report.photos && report.photos.length > 0 && (
          <Card className="mb-8 bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Project Photography
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      {report.photos.length} photo{report.photos.length > 1 ? 's' : ''} documenting this week's progress
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border-0">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Click to view</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <PhotoViewer photos={report.photos} />
            </CardContent>
          </Card>
        )}

        {/* Report Content - Exactly like builder's view */}
        <div className="space-y-6">
          {/* Executive Summary */}
          {report.executiveSummary && (
            <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                    Executive Summary
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 py-6">
                <HTMLContent 
                  content={report.executiveSummary}
                  className="text-gray-700 leading-relaxed prose prose-gray max-w-none"
                />
              </CardContent>
            </Card>
          )}

          {/* Work Completed - With backward compatibility */}
          {report.workCompleted && (
            (() => {
              try {
                // Try to parse as JSON
                const items = JSON.parse(report.workCompleted as string);
                return <WorkDisplay title="Work Completed This Week" items={items} />;
              } catch {
                // If parsing fails, it's HTML content from old reports
                return (
                  <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Work Completed This Week
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                      <HTMLContent 
                        content={report.workCompleted as string}
                        className="text-gray-700 leading-relaxed"
                      />
                    </CardContent>
                  </Card>
                );
              }
            })()
          )}

          {/* Upcoming Work - With backward compatibility */}
          {report.upcomingWork && (
            (() => {
              try {
                const items = JSON.parse(report.upcomingWork as string);
                return <WorkDisplay title="Upcoming Work" items={items} />;
              } catch {
                return (
                  <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Upcoming Work
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                      <HTMLContent 
                        content={report.upcomingWork as string}
                        className="text-gray-700 leading-relaxed"
                      />
                    </CardContent>
                  </Card>
                );
              }
            })()
          )}

          {/* Issues & Delays - With backward compatibility */}
          {report.issues && (
            (() => {
              try {
                const items = JSON.parse(report.issues as string);
                return <IssuesDisplay items={items} />;
              } catch {
                return (
                  <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Issues & Delays
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                      <HTMLContent 
                        content={report.issues as string}
                        className="text-gray-700 leading-relaxed"
                      />
                    </CardContent>
                  </Card>
                );
              }
            })()
          )}

          {/* Budget Updates - With backward compatibility */}
          {report.budget && (
            (() => {
              try {
                const items = JSON.parse(report.budget as string);
                return <BudgetDisplay items={items} />;
              } catch {
                return (
                  <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Budget & Change Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                      <HTMLContent 
                        content={report.budget as string}
                        className="text-gray-700 leading-relaxed"
                      />
                    </CardContent>
                  </Card>
                );
              }
            })()
          )}

          {/* Control Estimate Update */}
          {(report?.ceProfessionalFees || report?.ceConstructionCosts || report?.ceOffsiteUtilities || 
            report?.ceFFE || report?.ceInsuranceFinancing || report?.ceTotal || report?.ceContingency) && (
            <ControlEstimate 
              isEditing={false}
              initialData={{
                professionalFees: report?.ceProfessionalFees || undefined,
                constructionCosts: report?.ceConstructionCosts || undefined,
                offsiteUtilities: report?.ceOffsiteUtilities || undefined,
                ffe: report?.ceFFE || undefined,
                insuranceFinancing: report?.ceInsuranceFinancing || undefined,
                total: report?.ceTotal || undefined,
                contingency: report?.ceContingency || undefined,
                contingencyUsed: report?.ceContingencyUsed || undefined
              }}
            />
          )}

          {/* Client Actions - With backward compatibility */}
          {report.clientActions && (
            (() => {
              try {
                const items = JSON.parse(report.clientActions as string);
                return <ClientActionsDisplay items={items} />;
              } catch {
                return (
                  <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                      <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                        Client Actions Needed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 py-6">
                      <HTMLContent 
                        content={report.clientActions as string}
                        className="text-gray-700 leading-relaxed"
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