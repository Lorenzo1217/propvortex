export function getClientPortalUrl(projectId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://propvortex.com'
  return `${baseUrl}/client/portal/${projectId}`
}

export function getClientReportUrl(projectId: string, reportId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://propvortex.com'
  return `${baseUrl}/client/portal/${projectId}/reports/${reportId}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

export function getShareableProjectLink(projectId: string): string {
  const portalUrl = getClientPortalUrl(projectId)
  return portalUrl
}

export function getShareableReportLink(projectId: string, reportId: string): string {
  const reportUrl = getClientReportUrl(projectId, reportId)
  return reportUrl
}