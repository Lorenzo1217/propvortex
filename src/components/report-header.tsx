import { Company, Project, Report } from '@prisma/client'
import { Building2, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ReportHeaderProps {
  company: Company | null
  project: Project
  report: Report
  isClientView?: boolean
}

export default function ReportHeader({ 
  company, 
  project, 
  report,
  isClientView = false 
}: ReportHeaderProps) {
  const primaryColor = company?.primaryColor || '#000000'
  const accentColor = company?.accentColor || '#3B82F6'
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
      style={{
        borderTopWidth: '4px',
        borderTopStyle: 'solid',
        borderTopColor: accentColor
      }}
    >
      <div className="p-6">
        {/* Company Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {company?.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={company.name}
                className="h-12 w-auto max-w-[200px]"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 
                  className="h-10 w-10"
                  style={{ color: primaryColor }}
                />
                <div>
                  <h2 
                    className="text-xl font-semibold"
                    style={{ color: primaryColor }}
                  >
                    {company?.name || 'Construction Report'}
                  </h2>
                </div>
              </div>
            )}
          </div>
          <Badge 
            variant="secondary"
            className="text-lg px-3 py-1"
            style={{ 
              backgroundColor: `rgba(${hexToRgb(accentColor)}, 0.1)`,
              color: accentColor,
              borderColor: accentColor 
            }}
          >
            Week {report.weekNumber}, {report.year}
          </Badge>
        </div>

        {/* Report Title and Details */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">
            {report.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Building2 className="mr-1 h-4 w-4" />
              {project.name}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              {project.address}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {report.publishedAt 
                ? new Date(report.publishedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Draft Report'
              }
            </div>
          </div>

          {/* Executive Summary if present */}
          {report.executiveSummary && (
            <div 
              className="p-4 rounded-lg mt-4"
              style={{
                backgroundColor: `rgba(${hexToRgb(accentColor)}, 0.05)`,
                borderLeft: `4px solid ${accentColor}`
              }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: primaryColor }}
              >
                Executive Summary
              </h3>
              <p className="text-gray-700">{report.executiveSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}