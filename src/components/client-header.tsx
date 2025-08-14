'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, ChevronDown, FileText, Home, LogOut, User } from 'lucide-react'

interface ClientHeaderProps {
  client: {
    firstName: string
    lastName: string
    email: string
    projectId: string
  }
  company: {
    name: string
    logoUrl?: string | null
    primaryColor: string
    secondaryColor: string
    accentColor: string
  } | null | undefined
}

export default function ClientHeader({ client, company }: ClientHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/client/logout', { method: 'POST' })
      router.push('/client/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const primaryColor = company?.primaryColor || '#000000'
  const accentColor = company?.accentColor || '#3B82F6'

  return (
    <header 
      className="border-b bg-white shadow-sm"
      style={{
        borderTopWidth: '4px',
        borderTopStyle: 'solid',
        borderTopColor: primaryColor
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {company?.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={company.name}
                className="h-8 w-auto"
              />
            ) : (
              <div 
                className="flex items-center space-x-2"
                style={{ color: primaryColor }}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  {company?.name || 'Client Portal'}
                </span>
              </div>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/client/portal"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Home className="inline-block mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              href={`/client/portal/${client.projectId}`}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Building2 className="inline-block mr-1 h-4 w-4" />
              Project
            </Link>
            <Link 
              href={`/client/portal/${client.projectId}/reports`}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FileText className="inline-block mr-1 h-4 w-4" />
              Reports
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2"
                style={{
                  '--hover-color': accentColor,
                } as React.CSSProperties}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    {client.firstName[0]}{client.lastName[0]}
                  </div>
                  <span className="hidden md:block">
                    {client.firstName} {client.lastName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{client.firstName} {client.lastName}</span>
                  <span className="text-xs text-gray-500">{client.email}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}