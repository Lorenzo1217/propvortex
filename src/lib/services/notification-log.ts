import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface NotificationLogEntry {
  timestamp: Date
  type: 'email' | 'sms'
  recipient: string
  clientId: string
  projectId: string
  reportId: string
  success: boolean
  error?: string
  messageId?: string
  isFirstInvite?: boolean
}

class NotificationLogger {
  private logDir: string
  private logFile: string

  constructor() {
    // Create logs directory if it doesn't exist
    this.logDir = join(process.cwd(), 'logs')
    this.logFile = join(this.logDir, 'notifications.log')
    
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true })
    }
  }

  log(entry: NotificationLogEntry): void {
    const logLine = JSON.stringify({
      ...entry,
      timestamp: entry.timestamp.toISOString()
    }) + '\n'

    try {
      appendFileSync(this.logFile, logLine)
    } catch (error) {
      console.error('Failed to write to notification log:', error)
    }

    // Also log to console for immediate visibility
    console.log(`[NOTIFICATION LOG] ${entry.timestamp.toISOString()}`)
    console.log(`  Type: ${entry.type}`)
    console.log(`  Recipient: ${entry.recipient}`)
    console.log(`  Status: ${entry.success ? '✅ Success' : '❌ Failed'}`)
    if (entry.error) console.log(`  Error: ${entry.error}`)
    if (entry.messageId) console.log(`  Message ID: ${entry.messageId}`)
    if (entry.isFirstInvite) console.log(`  First Invite: Yes`)
  }

  async logBatch(
    projectId: string,
    reportId: string,
    results: Map<string, { email: { success: boolean; error: string | null; messageId?: string }; sms: { success: boolean; error: string | null } }>,
    clients: Array<{ id: string; email: string; phone?: string | null; firstName: string; lastName: string; isInvited: boolean }>
  ): Promise<void> {
    const timestamp = new Date()
    
    for (const [clientId, result] of results) {
      const client = clients.find(c => c.id === clientId)
      if (!client) continue

      // Log email notification
      this.log({
        timestamp,
        type: 'email',
        recipient: client.email,
        clientId,
        projectId,
        reportId,
        success: result.email.success,
        error: result.email.error || undefined,
        messageId: result.email.messageId,
        isFirstInvite: !client.isInvited
      })

      // Log SMS notification if phone exists
      if (client.phone) {
        this.log({
          timestamp,
          type: 'sms',
          recipient: client.phone,
          clientId,
          projectId,
          reportId,
          success: result.sms.success,
          error: result.sms.error || undefined,
          isFirstInvite: !client.isInvited
        })
      }
    }
  }

  getStats(): { total: number; successful: number; failed: number } {
    if (!existsSync(this.logFile)) {
      return { total: 0, successful: 0, failed: 0 }
    }

    // This is a simple implementation - in production, you might want to use a database
    // or a more efficient log parsing method
    try {
      const logs = require('fs').readFileSync(this.logFile, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map((line: string) => JSON.parse(line))
      
      return {
        total: logs.length,
        successful: logs.filter((log: any) => log.success).length,
        failed: logs.filter((log: any) => !log.success).length
      }
    } catch (error) {
      console.error('Failed to read notification stats:', error)
      return { total: 0, successful: 0, failed: 0 }
    }
  }
}

// Export singleton instance
export const notificationLogger = new NotificationLogger()

// Export types
export type { NotificationLogEntry }