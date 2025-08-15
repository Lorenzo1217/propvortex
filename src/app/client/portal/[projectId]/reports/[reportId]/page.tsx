import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ClientReportView from '@/components/client-report-view'

export default async function ClientReportPage({
  params
}: {
  params: Promise<{ projectId: string; reportId: string }>
}) {
  const { projectId, reportId } = await params
  
  // No authentication required - anyone with the link can view
  // Get report with all related data
  const report = await db.report.findFirst({
    where: {
      id: reportId,
      projectId,
      isPublished: true
    },
    include: {
      project: {
        include: {
          user: {
            include: {
              companyRelation: true
            }
          }
        }
      },
      photos: {
        orderBy: { uploadedAt: 'desc' }
      }
    }
  })

  if (!report) {
    return notFound()
  }

  const company = report.project.user.companyRelation

  return (
    <ClientReportView 
      report={report} 
      project={report.project}
      company={company}
    />
  )
}