import { Company } from '@prisma/client'

export interface BrandedStyles {
  primary: string
  secondary: string
  accent: string
  primaryRgb: string
  secondaryRgb: string
  accentRgb: string
  styles: {
    header: React.CSSProperties
    button: React.CSSProperties
    buttonOutline: React.CSSProperties
    link: React.CSSProperties
    badge: React.CSSProperties
    card: React.CSSProperties
    accent: React.CSSProperties
  }
}

// Convert hex to RGB values
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

// Generate branded styles based on company colors
export function getBrandedStyles(company: Company | null | undefined): BrandedStyles {
  const primary = company?.primaryColor || '#000000'
  const secondary = company?.secondaryColor || '#666666'
  const accent = company?.accentColor || '#3B82F6'
  
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary)
  const accentRgb = hexToRgb(accent)
  
  return {
    primary,
    secondary,
    accent,
    primaryRgb,
    secondaryRgb,
    accentRgb,
    styles: {
      header: {
        backgroundColor: primary,
        color: 'white',
        borderTopColor: accent,
        borderTopWidth: '4px',
        borderTopStyle: 'solid'
      },
      button: {
        backgroundColor: accent,
        color: 'white',
        borderColor: accent,
        '--hover-bg': `rgba(${accentRgb}, 0.9)`,
      } as React.CSSProperties,
      buttonOutline: {
        borderColor: accent,
        color: accent,
        backgroundColor: 'transparent',
        '--hover-bg': `rgba(${accentRgb}, 0.1)`,
      } as React.CSSProperties,
      link: {
        color: accent,
        '--hover-color': primary,
      } as React.CSSProperties,
      badge: {
        backgroundColor: `rgba(${accentRgb}, 0.1)`,
        color: accent,
        borderColor: `rgba(${accentRgb}, 0.3)`,
      } as React.CSSProperties,
      card: {
        borderColor: `rgba(${primaryRgb}, 0.1)`,
        '--accent-color': accent,
      } as React.CSSProperties,
      accent: {
        color: accent,
      }
    }
  }
}

// Generate CSS variables for use in global styles
export function generateCSSVariables(company: Company | null | undefined): string {
  const styles = getBrandedStyles(company)
  
  return `
    :root {
      --brand-primary: ${styles.primary};
      --brand-secondary: ${styles.secondary};
      --brand-accent: ${styles.accent};
      --brand-primary-rgb: ${styles.primaryRgb};
      --brand-secondary-rgb: ${styles.secondaryRgb};
      --brand-accent-rgb: ${styles.accentRgb};
    }
    
    .brand-header {
      background-color: var(--brand-primary);
      border-top: 4px solid var(--brand-accent);
    }
    
    .brand-button {
      background-color: var(--brand-accent);
      border-color: var(--brand-accent);
    }
    
    .brand-button:hover {
      background-color: rgba(var(--brand-accent-rgb), 0.9);
    }
    
    .brand-button-outline {
      border-color: var(--brand-accent);
      color: var(--brand-accent);
    }
    
    .brand-button-outline:hover {
      background-color: rgba(var(--brand-accent-rgb), 0.1);
    }
    
    .brand-link {
      color: var(--brand-accent);
    }
    
    .brand-link:hover {
      color: var(--brand-primary);
    }
    
    .brand-badge {
      background-color: rgba(var(--brand-accent-rgb), 0.1);
      color: var(--brand-accent);
      border: 1px solid rgba(var(--brand-accent-rgb), 0.3);
    }
    
    .brand-accent {
      color: var(--brand-accent);
    }
    
    .brand-primary {
      color: var(--brand-primary);
    }
    
    .brand-secondary {
      color: var(--brand-secondary);
    }
  `
}

// Get contrast color (white or black) based on background
export function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor)
  if (!result) return '#000000'
  
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Apply branded styles to an element
export function applyBrandedStyles(
  company: Company | null | undefined,
  styleType: keyof BrandedStyles['styles']
): React.CSSProperties {
  const brandedStyles = getBrandedStyles(company)
  return brandedStyles.styles[styleType]
}