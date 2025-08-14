'use client'

import { createContext, useContext, useEffect } from 'react'
import { Company } from '@prisma/client'

interface BrandContextType {
  company: Company | null
  isClient: boolean
}

const BrandContext = createContext<BrandContextType>({
  company: null,
  isClient: false
})

export function useBrand() {
  return useContext(BrandContext)
}

export function BrandProvider({ 
  children, 
  company, 
  isClient = false 
}: { 
  children: React.ReactNode
  company: Company | null
  isClient?: boolean
}) {
  useEffect(() => {
    if (company) {
      // Apply CSS variables to root
      document.documentElement.style.setProperty('--brand-primary', company.primaryColor)
      document.documentElement.style.setProperty('--brand-secondary', company.secondaryColor)
      document.documentElement.style.setProperty('--brand-accent', company.accentColor)
      
      // Calculate RGB values for opacity variations
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        if (!result) return '0, 0, 0'
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      }
      
      document.documentElement.style.setProperty('--brand-primary-rgb', hexToRgb(company.primaryColor))
      document.documentElement.style.setProperty('--brand-secondary-rgb', hexToRgb(company.secondaryColor))
      document.documentElement.style.setProperty('--brand-accent-rgb', hexToRgb(company.accentColor))
      
      // Set favicon if company has one (future feature)
      if (company.logoUrl) {
        const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (favicon) {
          // Could set to company favicon if available
        }
      }
      
      // Update page title with company name
      if (typeof document !== 'undefined') {
        const baseTitle = document.title.split(' - ')[0]
        document.title = `${baseTitle} - ${company.name}`
      }
    } else {
      // Set default PropVortex branding
      document.documentElement.style.setProperty('--brand-primary', '#000000')
      document.documentElement.style.setProperty('--brand-secondary', '#666666')
      document.documentElement.style.setProperty('--brand-accent', '#3B82F6')
      document.documentElement.style.setProperty('--brand-primary-rgb', '0, 0, 0')
      document.documentElement.style.setProperty('--brand-secondary-rgb', '102, 102, 102')
      document.documentElement.style.setProperty('--brand-accent-rgb', '59, 130, 246')
    }
  }, [company])

  return (
    <BrandContext.Provider value={{ company, isClient }}>
      {children}
    </BrandContext.Provider>
  )
}