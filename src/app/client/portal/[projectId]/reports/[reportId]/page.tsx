import { redirect } from 'next/navigation'
import { getCurrentClient } from '@/lib/auth/client-auth'
import { db } from '@/lib/db'
import ClientReportView from '@/components/client-report-view'

export default async function ClientReportPage({
  params
}: {
  params: Promise<{ projectId: string; reportId: string }>
}) {
  const { projectId, reportId } = await params
  const client = await getCurrentClient()
  
  if (!client || client.projectId !== projectId) {
    redirect('/client/login')
  }

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
    redirect(`/client/portal/${projectId}`)
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