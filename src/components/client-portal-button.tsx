'use client'

import { Button } from '@/components/ui/button'
import { getClientPortalUrl } from '@/lib/utils/client-links'

interface ClientPortalButtonProps {
  projectId: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

export function ClientPortalButton({ projectId, className = "flex-1 bg-gray-900 hover:bg-gray-800", size = "sm" }: ClientPortalButtonProps) {
  const handleClick = () => {
    const clientUrl = getClientPortalUrl(projectId)
    window.open(clientUrl, '_blank')
  }

  return (
    <Button 
      size={size} 
      className={className}
      onClick={handleClick}
    >
      Client Portal
    </Button>
  )
}