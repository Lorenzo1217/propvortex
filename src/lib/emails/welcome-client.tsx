import * as React from 'react'

interface WelcomeClientEmailProps {
  client: {
    firstName: string
    lastName: string
    email: string
    relationshipType?: string
  }
  project: {
    name: string
    address: string
  }
  company: {
    name: string
    logoUrl?: string | null
    primaryColor: string
    secondaryColor: string
    accentColor: string
  } | null
  passwordResetUrl?: string
  reportUrl: string
  companyName: string
  primaryColor: string
  accentColor: string
}

export function WelcomeClientEmail({
  client,
  project,
  company,
  passwordResetUrl,
  reportUrl,
  companyName,
  primaryColor,
  accentColor
}: WelcomeClientEmailProps) {
  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: '#f3f4f6'
    },
    container: {
      width: '100%',
      backgroundColor: '#f3f4f6',
      padding: '40px 20px'
    },
    wrapper: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    header: {
      backgroundColor: primaryColor,
      padding: '40px 40px 30px',
      textAlign: 'center' as const
    },
    logo: {
      maxHeight: '50px',
      marginBottom: '20px'
    },
    headerTitle: {
      margin: 0,
      color: 'white',
      fontSize: '28px',
      fontWeight: 600
    },
    content: {
      padding: '40px'
    },
    title: {
      margin: '0 0 20px',
      color: '#111827',
      fontSize: '24px',
      fontWeight: 600
    },
    paragraph: {
      margin: '0 0 20px',
      color: '#4b5563',
      fontSize: '16px',
      lineHeight: 1.6
    },
    ctaBox: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '20px',
      margin: '30px 0'
    },
    ctaTitle: {
      margin: '0 0 15px',
      color: '#111827',
      fontSize: '18px',
      fontWeight: 600
    },
    button: {
      display: 'inline-block',
      backgroundColor: accentColor,
      color: 'white',
      padding: '12px 24px',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: 600,
      fontSize: '16px'
    },
    list: {
      margin: '0 0 20px',
      paddingLeft: '20px',
      color: '#4b5563',
      fontSize: '16px',
      lineHeight: 1.8
    },
    footer: {
      backgroundColor: '#f9fafb',
      padding: '30px 40px',
      textAlign: 'center' as const,
      borderTop: '1px solid #e5e7eb'
    },
    footerText: {
      margin: '0 0 10px',
      color: '#6b7280',
      fontSize: '14px'
    },
    footerSubtext: {
      margin: 0,
      color: '#9ca3af',
      fontSize: '12px'
    }
  }

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to {project.name}</title>
      </head>
      <body style={styles.body}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={styles.container}>
          <tr>
            <td align="center">
              <table cellPadding="0" cellSpacing="0" style={styles.wrapper}>
                {/* Header */}
                <tr>
                  <td style={styles.header}>
                    {company?.logoUrl && (
                      <img 
                        src={company.logoUrl} 
                        alt={companyName}
                        style={styles.logo}
                      />
                    )}
                    <h1 style={styles.headerTitle}>
                      {companyName}
                    </h1>
                  </td>
                </tr>
                
                {/* Content */}
                <tr>
                  <td style={styles.content}>
                    <h2 style={styles.title}>
                      Welcome to Your Project Portal! 🎉
                    </h2>
                    
                    <p style={styles.paragraph}>
                      Dear {client.firstName} {client.lastName},
                    </p>
                    
                    <p style={styles.paragraph}>
                      We're excited to have you as part of the <strong>{project.name}</strong> project! 
                      Your dedicated project portal is now ready, where you can view weekly progress reports, 
                      photos, and important updates.
                    </p>
                    
                    <div style={styles.ctaBox}>
                      <h3 style={styles.ctaTitle}>
                        Get Started:
                      </h3>
                      <p style={styles.paragraph}>
                        First, you'll need to set up your password to access the portal:
                      </p>
                      <a href={passwordResetUrl} style={styles.button}>
                        Set Up Password
                      </a>
                      <p style={{ ...styles.paragraph, marginTop: '15px', color: '#6b7280', fontSize: '14px' }}>
                        This link will expire in 24 hours for security purposes.
                      </p>
                    </div>
                    
                    <h3 style={styles.ctaTitle}>
                      Project Details:
                    </h3>
                    <ul style={styles.list}>
                      <li><strong>Project:</strong> {project.name}</li>
                      <li><strong>Address:</strong> {project.address}</li>
                      <li><strong>Your Role:</strong> {client.relationshipType || 'Client'}</li>
                    </ul>
                    
                    <p style={{ ...styles.paragraph, marginTop: '30px' }}>
                      You'll receive notifications whenever new reports are published. 
                      If you have any questions, please don't hesitate to reach out to your project manager.
                    </p>
                  </td>
                </tr>
                
                {/* Footer */}
                <tr>
                  <td style={styles.footer}>
                    <p style={styles.footerText}>
                      © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                    <p style={styles.footerSubtext}>
                      Made with <a href="https://propvortex.com" style={{ color: '#6b7280', textDecoration: 'none' }}>PropVortex</a> • Construction Project Management
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}