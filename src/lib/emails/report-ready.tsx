import * as React from 'react'

interface ReportReadyEmailProps {
  client: {
    firstName: string
    lastName: string
    email: string
  }
  project: {
    name: string
    address: string
  }
  report: {
    title: string
    weekNumber: number
    year: number
    executiveSummary?: string | null
    publishedAt?: Date | null
  }
  company: {
    name: string
    logoUrl?: string | null
    primaryColor: string
    secondaryColor: string
    accentColor: string
  } | null
  reportUrl: string
  companyName: string
  primaryColor: string
  accentColor: string
}

export function ReportReadyEmail({
  client,
  project,
  report,
  company,
  reportUrl,
  companyName,
  primaryColor,
  accentColor
}: ReportReadyEmailProps) {
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
    reportBox: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '20px',
      margin: '30px 0'
    },
    reportTitle: {
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
    summaryBox: {
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '15px',
      margin: '20px 0'
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
    },
    highlightBox: {
      backgroundColor: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '6px',
      padding: '15px',
      margin: '20px 0'
    },
    highlightText: {
      margin: 0,
      color: '#1e40af',
      fontSize: '14px',
      fontWeight: 500
    }
  }

  const publishedDate = report.publishedAt 
    ? new Date(report.publishedAt).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Report Available - {project.name}</title>
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
                      Your Weekly Report is Ready! 📊
                    </h2>
                    
                    <p style={styles.paragraph}>
                      Hi {client.firstName},
                    </p>
                    
                    <p style={styles.paragraph}>
                      A new weekly report for <strong>{project.name}</strong> has been published 
                      and is ready for your review.
                    </p>
                    
                    <div style={styles.reportBox}>
                      <h3 style={styles.reportTitle}>
                        Report Details:
                      </h3>
                      <ul style={styles.list}>
                        <li><strong>Week:</strong> {report.weekNumber}, {report.year}</li>
                        <li><strong>Title:</strong> {report.title}</li>
                        <li><strong>Published:</strong> {publishedDate}</li>
                      </ul>
                      
                      <a href={reportUrl} style={styles.button}>
                        View Report
                      </a>
                    </div>
                    
                    {report.executiveSummary && (
                      <>
                        <h3 style={styles.reportTitle}>
                          Executive Summary:
                        </h3>
                        <div style={styles.summaryBox}>
                          <p style={{ ...styles.paragraph, margin: 0 }}>
                            {report.executiveSummary}
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div style={styles.highlightBox}>
                      <p style={styles.highlightText}>
                        💡 <strong>What's included in this report:</strong>
                      </p>
                      <ul style={{ ...styles.list, margin: '10px 0 0', fontSize: '14px' }}>
                        <li>Work completed this week</li>
                        <li>Upcoming work schedule</li>
                        <li>Project photos and progress updates</li>
                        <li>Budget and timeline information</li>
                        <li>Any issues or items requiring your attention</li>
                      </ul>
                    </div>
                    
                    <p style={{ ...styles.paragraph, marginTop: '30px' }}>
                      Log in to your portal to view detailed progress updates, photos, and more. 
                      If you have any questions about this report, please don't hesitate to contact your project manager.
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
                      Made with <a href="https://propvortex.com" style={{ color: '#9ca3af', textDecoration: 'none' }}>PropVortex</a> • Construction Project Management
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