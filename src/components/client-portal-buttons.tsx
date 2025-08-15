'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink, Copy } from 'lucide-react'
import { getClientPortalUrl, copyToClipboard } from '@/lib/utils/client-links'
import { useState } from 'react'

interface ClientPortalButtonsProps {
  projectId: string
}

export function ClientPortalButtons({ projectId }: ClientPortalButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleOpenPortal = () => {
    const clientUrl = getClientPortalUrl(projectId)
    window.open(clientUrl, '_blank')
  }

  const handleCopyLink = async () => {
    const clientUrl = getClientPortalUrl(projectId)
    const success = await copyToClipboard(clientUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpenPortal}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Client Portal
      </Button>
      <Button
        variant="outline"
        onClick={handleCopyLink}
      >
        <Copy className="w-4 h-4 mr-2" />
        {copied ? 'Copied!' : 'Copy Link'}
      </Button>
    </>
  )
}