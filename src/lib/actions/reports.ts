'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { fetchWeatherForecast } from '@/lib/services/weather'

export async function createReport(formData: FormData, projectId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  // Get the database user
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  // Verify user owns the project
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: dbUser.id
    }
  })

  if (!project) {
    throw new Error('Project not found or access denied')
  }

  // Extract form data with updated handling for JSON fields
  const title = formData.get('title') as string
  const executiveSummary = formData.get('executiveSummary') as string
  const workCompletedData = formData.get('workCompleted') as string
  const upcomingWorkData = formData.get('upcomingWork') as string
  const issuesData = formData.get('issues') as string
  const budgetData = formData.get('budget') as string
  const clientActionsData = formData.get('clientActions') as string
  
  // Extract Control Estimate fields
  const ceProfessionalFees = formData.get('ceProfessionalFees') as string
  const ceConstructionCosts = formData.get('ceConstructionCosts') as string
  const ceOffsiteUtilities = formData.get('ceOffsiteUtilities') as string
  const ceFFE = formData.get('ceFFE') as string
  const ceInsuranceFinancing = formData.get('ceInsuranceFinancing') as string
  const ceTotal = formData.get('ceTotal') as string
  const ceContingency = formData.get('ceContingency') as string
  const ceContingencyUsed = formData.get('ceContingencyUsed') as string

  // Parse the JSON data
  const workCompleted = workCompletedData ? JSON.parse(workCompletedData) : null
  const upcomingWork = upcomingWorkData ? JSON.parse(upcomingWorkData) : null
  const issues = issuesData ? JSON.parse(issuesData) : null
  const budget = budgetData ? JSON.parse(budgetData) : null
  const clientActions = clientActionsData ? JSON.parse(clientActionsData) : null

  // Debug logging
  console.log('📝 Form data received:')
  console.log('Title:', title)
  console.log('Executive Summary:', executiveSummary)
  console.log('Work Completed:', workCompleted)
  console.log('Upcoming Work:', upcomingWork)
  console.log('Issues:', issues)
  console.log('Budget:', budget)
  console.log('Client Actions:', clientActions)

  // Calculate week number and year
  const now = new Date()
  let year = now.getFullYear()
  let weekNumber = getWeekNumber(now)

  // Validate required fields
  let titleToUse = formData.get('title') as string
  if (!titleToUse) {
    throw new Error('Report title is required')
  }

  try {
    // Check if a report already exists for this week and auto-advance if needed
    let existingReport = await db.report.findFirst({
      where: {
        projectId,
        weekNumber,
        year
      }
    })

    // If report exists for current week, advance to next available week
    let weeksAdvanced = 0
    while (existingReport && weeksAdvanced < 52) {  // Prevent infinite loop
      weekNumber++
      if (weekNumber > 52) {
        weekNumber = 1
        year++
      }
      
      existingReport = await db.report.findFirst({
        where: {
          projectId,
          weekNumber,
          year
        }
      })
      
      weeksAdvanced++
    }

    // Update the title to reflect the correct week if we advanced
    if (weeksAdvanced > 0) {
      // Replace week number in title if it exists
      titleToUse = titleToUse.replace(/Week \d+/, `Week ${weekNumber}`)
      console.log(`📅 Auto-advanced ${weeksAdvanced} week(s) to Week ${weekNumber}, ${year}`)
    }

    // Fetch weather data using project location
    let weatherData = null
    try {
      weatherData = await fetchWeatherForecast(
        project.zipCode || '',
        project.city || '',
        project.state || ''
      )
      console.log('✅ Weather data fetched for location:', weatherData.location)
    } catch (weatherError) {
      console.error('⚠️ Weather fetch failed:', weatherError)
      // Continue without weather data - don't fail report creation
    }

    // Create the report with JSON data stringified
    const report = await db.report.create({
      data: {
        title: titleToUse,
        executiveSummary: executiveSummary || null,
        workCompleted: workCompleted ? JSON.stringify(workCompleted) : undefined,
        upcomingWork: upcomingWork ? JSON.stringify(upcomingWork) : undefined,
        issues: issues ? JSON.stringify(issues) : undefined,
        budget: budget ? JSON.stringify(budget) : undefined,
        clientActions: clientActions ? JSON.stringify(clientActions) : undefined,
        weekNumber,
        year,
        projectId,
        isPublished: false, // Start as draft
        weatherData: weatherData ? JSON.stringify(weatherData) : undefined,
        weatherFetchedAt: weatherData ? new Date() : null,
        // Control Estimate fields
        ceProfessionalFees: ceProfessionalFees || null,
        ceConstructionCosts: ceConstructionCosts || null,
        ceOffsiteUtilities: ceOffsiteUtilities || null,
        ceFFE: ceFFE || null,
        ceInsuranceFinancing: ceInsuranceFinancing || null,
        ceTotal: ceTotal || null,
        ceContingency: ceContingency || null,
        ceContingencyUsed: ceContingencyUsed || null
      }
    })

    console.log('✅ Report created:', report.title)
    console.log('💾 Saved content:', {
      executiveSummary: report.executiveSummary,
      workCompleted: report.workCompleted,
      upcomingWork: report.upcomingWork,
      weatherData: report.weatherData ? 'Weather data saved' : 'No weather data'
    })

    // Revalidate the project page to show the new report
    revalidatePath(`/projects/${projectId}`)
    
    return { success: true, report }
  } catch (error: any) {
    console.error('❌ Error creating report:', error)
    
    // More user-friendly error message for unique constraint violations
    if (error.code === 'P2002') {
      throw new Error('A report already exists for this week. The system should have auto-advanced, but an error occurred. Please try again.')
    }
    
    throw error
  }
}

export async function publishReport(reportId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the report and verify ownership
    const report = await db.report.findFirst({
      where: {
        id: reportId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      },
      include: {
        project: {
          include: {
            clients: true,
            user: {
              include: {
                companyRelation: true
              }
            }
          }
        }
      }
    })

    if (!report) {
      throw new Error('Report not found or access denied')
    }

    // Check if this is the first published report for the project
    const previousPublishedReports = await db.report.count({
      where: {
        projectId: report.projectId,
        isPublished: true,
        id: {
          not: reportId
        }
      }
    })
    
    const isFirstReport = previousPublishedReports === 0

    // Update report to published
    const updatedReport = await db.report.update({
      where: { id: reportId },
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    })

    console.log('✅ Report published:', updatedReport.title)

    // Send notifications to all project clients
    if (report.project.clients.length > 0) {
      console.log(`📧 Sending notifications to ${report.project.clients.length} clients...`)
      
      const { sendBatchNotifications } = await import('@/lib/services/notifications')
      
      const notificationResults = await sendBatchNotifications(
        report.project.clients,
        report.project,
        updatedReport,
        report.project.user.companyRelation,
        isFirstReport
      )
      
      // Update client invitation status for first-time clients
      const clientsToUpdate = report.project.clients.filter(client => !client.isInvited)
      if (clientsToUpdate.length > 0) {
        console.log(`📝 Updating invitation status for ${clientsToUpdate.length} clients...`)
        
        await db.projectClient.updateMany({
          where: {
            id: {
              in: clientsToUpdate.map(c => c.id)
            }
          },
          data: {
            isInvited: true,
            invitedAt: new Date()
          }
        })
      }
      
      // Log notification summary
      let successCount = 0
      let failureCount = 0
      notificationResults.forEach((result) => {
        if (result.email.success) successCount++
        else failureCount++
      })
      
      console.log(`📊 Notification Summary: ${successCount} successful, ${failureCount} failed`)
    } else {
      console.log('ℹ️ No clients to notify for this project')
    }

    // Revalidate the project page
    revalidatePath(`/projects/${report.projectId}`)
    
    return { success: true, report: updatedReport }
  } catch (error) {
    console.error('❌ Error publishing report:', error)
    throw error
  }
}

export async function updateReport(formData: FormData, reportId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  // Get the database user
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUserId }
  })

  if (!dbUser) {
    throw new Error('User not found in database')
  }

  try {
    // Verify user owns the report through project relationship
    const existingReport = await db.report.findFirst({
      where: {
        id: reportId,
        project: {
          userId: dbUser.id
        }
      },
      include: {
        project: true
      }
    })

    if (!existingReport) {
      throw new Error('Report not found or access denied')
    }

    // Extract form data with updated handling for JSON fields
    const title = formData.get('title') as string
    const executiveSummary = formData.get('executiveSummary') as string
    const workCompletedData = formData.get('workCompleted') as string
    const upcomingWorkData = formData.get('upcomingWork') as string
    const issuesData = formData.get('issues') as string
    const budgetData = formData.get('budget') as string
    const clientActionsData = formData.get('clientActions') as string
    
    // Extract Control Estimate fields
    const ceProfessionalFees = formData.get('ceProfessionalFees') as string
    const ceConstructionCosts = formData.get('ceConstructionCosts') as string
    const ceOffsiteUtilities = formData.get('ceOffsiteUtilities') as string
    const ceFFE = formData.get('ceFFE') as string
    const ceInsuranceFinancing = formData.get('ceInsuranceFinancing') as string
    const ceTotal = formData.get('ceTotal') as string
    const ceContingency = formData.get('ceContingency') as string
    const ceContingencyUsed = formData.get('ceContingencyUsed') as string

    // Parse the JSON data
    const workCompleted = workCompletedData ? JSON.parse(workCompletedData) : null
    const upcomingWork = upcomingWorkData ? JSON.parse(upcomingWorkData) : null
    const issues = issuesData ? JSON.parse(issuesData) : null
    const budget = budgetData ? JSON.parse(budgetData) : null
    const clientActions = clientActionsData ? JSON.parse(clientActionsData) : null

    // Debug logging
    console.log('📝 UPDATE: Form data received:')
    console.log('Report ID:', reportId)
    console.log('Title:', title)
    console.log('Executive Summary:', executiveSummary)
    console.log('Work Completed:', workCompleted)
    console.log('Upcoming Work:', upcomingWork)
    console.log('Issues:', issues)
    console.log('Budget:', budget)
    console.log('Client Actions:', clientActions)

    // Update the report with JSON data stringified
    const updatedReport = await db.report.update({
      where: { id: reportId },
      data: {
        title: title || existingReport.title,
        executiveSummary: executiveSummary || null,
        workCompleted: workCompleted ? JSON.stringify(workCompleted) : undefined,
        upcomingWork: upcomingWork ? JSON.stringify(upcomingWork) : undefined,
        issues: issues ? JSON.stringify(issues) : undefined,
        budget: budget ? JSON.stringify(budget) : undefined,
        clientActions: clientActions ? JSON.stringify(clientActions) : undefined,
        // Control Estimate fields
        ceProfessionalFees: ceProfessionalFees || null,
        ceConstructionCosts: ceConstructionCosts || null,
        ceOffsiteUtilities: ceOffsiteUtilities || null,
        ceFFE: ceFFE || null,
        ceInsuranceFinancing: ceInsuranceFinancing || null,
        ceTotal: ceTotal || null,
        ceContingency: ceContingency || null,
        ceContingencyUsed: ceContingencyUsed || null,
        updatedAt: new Date()
      }
    })

    console.log('✅ Report updated:', updatedReport.title)
    console.log('💾 Updated content:', {
      executiveSummary: updatedReport.executiveSummary,
      workCompleted: updatedReport.workCompleted,
      upcomingWork: updatedReport.upcomingWork
    })

    // Revalidate relevant pages
    revalidatePath(`/projects/${existingReport.projectId}`)
    revalidatePath(`/projects/${existingReport.projectId}/reports/${reportId}`)
    revalidatePath(`/projects/${existingReport.projectId}/reports/${reportId}/edit`)
    
    return { success: true, report: updatedReport }
  } catch (error) {
    console.error('❌ Error updating report:', error)
    throw error
  }
}

export async function refreshWeatherData(reportId: string) {
  const { userId: clerkUserId } = await auth()
  
  if (!clerkUserId) {
    redirect('/login')
  }

  try {
    // Get the report and verify ownership
    const report = await db.report.findFirst({
      where: {
        id: reportId,
        project: {
          user: {
            clerkId: clerkUserId
          }
        }
      },
      include: {
        project: true
      }
    })

    if (!report) {
      throw new Error('Report not found or access denied')
    }

    // Fetch fresh weather data
    const weatherData = await fetchWeatherForecast(
      report.project.zipCode || '',
      report.project.city || '',
      report.project.state || ''
    )

    // Update report with new weather data
    const updatedReport = await db.report.update({
      where: { id: reportId },
      data: {
        weatherData: JSON.stringify(weatherData),
        weatherFetchedAt: new Date()
      }
    })

    console.log('✅ Weather data refreshed for report:', updatedReport.title)

    // Revalidate pages
    revalidatePath(`/projects/${report.projectId}/reports/${reportId}`)
    revalidatePath(`/projects/${report.projectId}/reports/${reportId}/edit`)
    
    return { success: true, report: updatedReport }
  } catch (error) {
    console.error('❌ Error refreshing weather:', error)
    throw error
  }
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}