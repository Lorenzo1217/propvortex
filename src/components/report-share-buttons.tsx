'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink, Copy, Share, Eye, Download } from 'lucide-react'
import { getClientReportUrl, copyToClipboard } from '@/lib/utils/client-links'
import { useState } from 'react'

interface ReportShareButtonsProps {
  projectId: string
  reportId: string
  isPublished: boolean
}

export function ReportShareButtons({ projectId, reportId, isPublished }: ReportShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleOpenClientView = () => {
    const clientUrl = getClientReportUrl(projectId, reportId)
    window.open(clientUrl, '_blank')
  }

  const handleCopyLink = async () => {
    const clientUrl = getClientReportUrl(projectId, reportId)
    const success = await copyToClipboard(clientUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={handleCopyLink}
      >
        {copied ? (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Share className="w-4 h-4 mr-2" />
            Share Link
          </>
        )}
      </Button>
      
      <Button variant="outline" disabled>
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
      
      {isPublished && (
        <Button 
          variant="outline"
          onClick={handleOpenClientView}
        >
          <Eye className="w-4 h-4 mr-2" />
          Client View
        </Button>
      )}
    </>
  )
}