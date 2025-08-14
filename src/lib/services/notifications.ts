import { Company, ProjectClient, Project, Report } from '@prisma/client'

// Check if Resend is available
let resend: any = null
try {
  const { Resend } = require('resend')
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  } else {
    console.warn('⚠️ RESEND_API_KEY not found in environment variables')
    console.warn('📧 Email notifications will be logged to console only')
  }
} catch (error) {
  console.warn('⚠️ Resend package not installed. Run: npm install resend')
  console.warn('📧 Email notifications will be logged to console only')
}

// For SMS, we'll log to console until Twilio is configured
// Later: import twilio from 'twilio'
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export interface NotificationData {
  client: ProjectClient
  project: Project
  report: Report
  company: Company | null
  isFirstReport: boolean
  reportUrl: string
  passwordResetUrl?: string
}

export interface NotificationResult {
  email: { success: boolean; error: string | null; messageId?: string }
  sms: { success: boolean; error: string | null }
}

export async function sendReportNotification(data: NotificationData): Promise<NotificationResult> {
  const results: NotificationResult = {
    email: { success: false, error: null },
    sms: { success: false, error: null }
  }

  // Send email
  try {
    const emailHtml = data.isFirstReport 
      ? await renderWelcomeEmail(data)
      : await renderReportReadyEmail(data)
    
    const emailSubject = data.isFirstReport 
      ? `Welcome to Your ${data.project.name} Project Portal`
      : `Weekly Report Ready - ${data.project.name}`

    if (resend) {
      // Actually send email via Resend
      const { data: emailData, error } = await resend.emails.send({
        from: data.company?.name 
          ? `${data.company.name} <notifications@propvortex.com>`
          : 'PropVortex <notifications@propvortex.com>',
        to: data.client.email,
        subject: emailSubject,
        html: emailHtml,
      })
      
      if (error) throw error
      
      results.email.success = true
      results.email.messageId = emailData?.id
      
      console.log('✅ Email sent successfully to:', data.client.email)
      console.log('   Message ID:', emailData?.id)
    } else {
      // Log email to console if Resend is not configured
      console.log('📧 EMAIL NOTIFICATION (Console Mode)')
      console.log('   To:', data.client.email)
      console.log('   From:', data.company?.name ? `${data.company.name} <notifications@propvortex.com>` : 'PropVortex <notifications@propvortex.com>')
      console.log('   Subject:', emailSubject)
      console.log('   Type:', data.isFirstReport ? 'Welcome Email' : 'Report Ready')
      if (data.isFirstReport && data.passwordResetUrl) {
        console.log('   Password Setup URL:', data.passwordResetUrl)
      }
      console.log('   Report URL:', data.reportUrl)
      
      results.email.success = true
      results.email.error = 'Email logged to console (Resend not configured)'
    }
  } catch (error: any) {
    console.error('❌ Email send error:', error)
    results.email.error = error.message || 'Unknown email error'
  }

  // Send SMS (console.log for now, implement Twilio later)
  if (data.client.phone) {
    try {
      const smsMessage = data.isFirstReport
        ? `Welcome to ${data.project.name}! Your project portal is ready. Set up your password: ${data.passwordResetUrl}`
        : `Your weekly report for ${data.project.name} is ready to view: ${data.reportUrl}`
      
      // For now, just log to console
      console.log('📱 SMS NOTIFICATION (Console Mode)')
      console.log('   To:', data.client.phone)
      console.log('   Message:', smsMessage)
      
      // Later with Twilio:
      // if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      //   await twilioClient.messages.create({
      //     body: smsMessage,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: data.client.phone
      //   })
      // }
      
      results.sms.success = true
      results.sms.error = 'SMS logged to console (Twilio not configured)'
    } catch (error: any) {
      console.error('❌ SMS send error:', error)
      results.sms.error = error.message || 'Unknown SMS error'
    }
  }

  // Log notification summary
  console.log('📊 Notification Summary:')
  console.log(`   Client: ${data.client.firstName} ${data.client.lastName} (${data.client.email})`)
  console.log(`   Project: ${data.project.name}`)
  console.log(`   Report: Week ${data.report.weekNumber}, ${data.report.year}`)
  console.log(`   Email Status: ${results.email.success ? '✅ Success' : '❌ Failed'} ${results.email.error ? `(${results.email.error})` : ''}`)
  console.log(`   SMS Status: ${data.client.phone ? (results.sms.success ? '✅ Success' : '❌ Failed') : '⏭️ Skipped (no phone)'} ${results.sms.error ? `(${results.sms.error})` : ''}`)

  return results
}

// Helper to render branded welcome email
async function renderWelcomeEmail(data: NotificationData): Promise<string> {
  const companyName = data.company?.name || 'Your Builder'
  const primaryColor = data.company?.primaryColor || '#000000'
  const accentColor = data.company?.accentColor || '#3B82F6'
  
  // Import email template if it exists, otherwise use fallback
  try {
    const { WelcomeClientEmail } = await import('@/lib/emails/welcome-client')
    const { renderToStaticMarkup } = await import('react-dom/server')
    return renderToStaticMarkup(WelcomeClientEmail({ 
      ...data,
      companyName,
      primaryColor,
      accentColor 
    }))
  } catch (error) {
    // Fallback HTML if React Email components are not available
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${data.project.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${primaryColor}; padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">
                ${companyName}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">
                Welcome to Your Project Portal! 🎉
              </h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dear ${data.client.firstName} ${data.client.lastName},
              </p>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We're excited to have you as part of the <strong>${data.project.name}</strong> project! 
                Your dedicated project portal is now ready, where you can view weekly progress reports, 
                photos, and important updates.
              </p>
              
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px; font-weight: 600;">
                  Get Started:
                </h3>
                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px;">
                  First, you'll need to set up your password to access the portal:
                </p>
                <a href="${data.passwordResetUrl}" 
                   style="display: inline-block; background-color: ${accentColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Set Up Password
                </a>
                <p style="margin: 15px 0 0; color: #6b7280; font-size: 14px;">
                  This link will expire in 24 hours for security purposes.
                </p>
              </div>
              
              <h3 style="margin: 30px 0 15px; color: #111827; font-size: 18px; font-weight: 600;">
                Project Details:
              </h3>
              <ul style="margin: 0 0 20px; padding-left: 20px; color: #4b5563; font-size: 16px; line-height: 1.8;">
                <li><strong>Project:</strong> ${data.project.name}</li>
                <li><strong>Address:</strong> ${data.project.address}</li>
                <li><strong>Your Role:</strong> ${data.client.relationshipType || 'Client'}</li>
              </ul>
              
              <p style="margin: 30px 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                You'll receive notifications whenever new reports are published. 
                If you have any questions, please don't hesitate to reach out to your project manager.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Powered by PropVortex - Construction Project Management
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()
  }
}

// Helper to render branded report ready email
async function renderReportReadyEmail(data: NotificationData): Promise<string> {
  const companyName = data.company?.name || 'Your Builder'
  const primaryColor = data.company?.primaryColor || '#000000'
  const accentColor = data.company?.accentColor || '#3B82F6'
  
  // Import email template if it exists, otherwise use fallback
  try {
    const { ReportReadyEmail } = await import('@/lib/emails/report-ready')
    const { renderToStaticMarkup } = await import('react-dom/server')
    return renderToStaticMarkup(ReportReadyEmail({ 
      ...data,
      companyName,
      primaryColor,
      accentColor 
    }))
  } catch (error) {
    // Fallback HTML if React Email components are not available
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Report Available - ${data.project.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${primaryColor}; padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">
                ${companyName}
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">
                Your Weekly Report is Ready! 📊
              </h2>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hi ${data.client.firstName},
              </p>
              
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                A new weekly report for <strong>${data.project.name}</strong> has been published 
                and is ready for your review.
              </p>
              
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #111827; font-size: 18px; font-weight: 600;">
                  Report Details:
                </h3>
                <ul style="margin: 0 0 20px; padding-left: 20px; color: #4b5563; font-size: 16px; line-height: 1.8;">
                  <li><strong>Week:</strong> ${data.report.weekNumber}, ${data.report.year}</li>
                  <li><strong>Title:</strong> ${data.report.title}</li>
                  <li><strong>Published:</strong> ${new Date(data.report.publishedAt || new Date()).toLocaleDateString()}</li>
                </ul>
                
                <a href="${data.reportUrl}" 
                   style="display: inline-block; background-color: ${accentColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  View Report
                </a>
              </div>
              
              ${data.report.executiveSummary ? `
              <h3 style="margin: 30px 0 15px; color: #111827; font-size: 18px; font-weight: 600;">
                Executive Summary:
              </h3>
              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${data.report.executiveSummary}
              </p>
              ` : ''}
              
              <p style="margin: 30px 0 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Log in to your portal to view detailed progress updates, photos, and more.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Powered by PropVortex - Construction Project Management
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()
  }
}

// Batch send notifications to multiple clients
export async function sendBatchNotifications(
  clients: ProjectClient[],
  project: Project,
  report: Report,
  company: Company | null,
  isFirstReport: boolean
): Promise<Map<string, NotificationResult>> {
  const results = new Map<string, NotificationResult>()
  
  console.log(`\n🚀 Starting batch notifications for ${clients.length} clients...`)
  
  for (const client of clients) {
    try {
      // Generate URLs for this client
      const reportUrl = await generateReportUrl(project.id, report.id)
      let passwordResetUrl: string | undefined
      
      if (isFirstReport && !client.isInvited) {
        // Generate password reset token for first-time clients
        const { generatePasswordResetToken, generatePasswordSetupUrl } = await import('@/lib/auth/client-tokens')
        const token = await generatePasswordResetToken(client.id)
        passwordResetUrl = await generatePasswordSetupUrl(project.id, token)
      }
      
      const result = await sendReportNotification({
        client,
        project,
        report,
        company,
        isFirstReport: !client.isInvited,
        reportUrl,
        passwordResetUrl
      })
      
      results.set(client.id, result)
    } catch (error) {
      console.error(`❌ Failed to send notification to ${client.email}:`, error)
      results.set(client.id, {
        email: { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
        sms: { success: false, error: 'Not attempted due to email error' }
      })
    }
  }
  
  // Log all notifications to file
  try {
    const { notificationLogger } = await import('./notification-log')
    await notificationLogger.logBatch(project.id, report.id, results, clients)
    
    const stats = notificationLogger.getStats()
    console.log(`📊 Total notifications logged: ${stats.total} (${stats.successful} successful, ${stats.failed} failed)`)
  } catch (error) {
    console.error('Failed to log notifications:', error)
  }
  
  console.log(`✅ Batch notifications complete. Sent to ${results.size} clients.\n`)
  
  return results
}

// Helper to generate report URL
async function generateReportUrl(projectId: string, reportId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/client/portal/${projectId}/reports/${reportId}`
}