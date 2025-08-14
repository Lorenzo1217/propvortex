'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, CheckCircle2, AlertCircle, 
  DollarSign, Briefcase, Users, Cloud, Image,
  FileText, TrendingUp, Clock, MapPin,
  ChevronRight, Download
} from 'lucide-react'

interface ClientReportViewProps {
  report: any
  project: any
  company: any
}

export default function ClientReportView({ report, project, company }: ClientReportViewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  
  const accentColor = company?.accentColor || '#3B82F6'
  const primaryColor = company?.primaryColor || '#000000'

  // Parse JSON fields
  const workCompleted = report.workCompleted ? JSON.parse(report.workCompleted) : []
  const upcomingWork = report.upcomingWork ? JSON.parse(report.upcomingWork) : []
  const issues = report.issues ? JSON.parse(report.issues) : []
  const budget = report.budget ? JSON.parse(report.budget) : null
  const clientActions = report.clientActions ? JSON.parse(report.clientActions) : []
  const weatherData = report.weatherData ? JSON.parse(report.weatherData) : null

  // Group photos by tags
  const photosByArea = report.photos.reduce((acc: any, photo: any) => {
    const tags = photo.tags || []
    const area = tags.find((tag: string) => 
      ['Kitchen', 'Master Bedroom', 'Living Room', 'Bathroom', 'Exterior', 'Foundation', 'Roof'].includes(tag)
    ) || 'Other'
    
    if (!acc[area]) acc[area] = []
    acc[area].push(photo)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/client/portal/${project.id}/reports`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {report.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Badge variant="secondary">
                Week {report.weekNumber}, {report.year}
              </Badge>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Published {report.publishedAt && new Date(report.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {project.name}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {report.executiveSummary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <FileText className="mr-2 h-4 w-4" style={{ color: accentColor }} />
              Executive Summary
            </h3>
            <p className="text-gray-700">{report.executiveSummary}</p>
          </div>
        )}
      </div>

      {/* Weather Widget */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="mr-2 h-5 w-5" style={{ color: accentColor }} />
              Weather This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {weatherData.forecast?.forecastday?.slice(0, 7).map((day: any) => (
                <div key={day.date} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <img 
                    src={`https:${day.day.condition.icon}`} 
                    alt={day.day.condition.text}
                    className="w-10 h-10 mx-auto"
                  />
                  <p className="text-sm font-semibold">
                    {Math.round(day.day.maxtemp_f)}°
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(day.day.mintemp_f)}°
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          {/* Work Completed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                Work Completed This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workCompleted.length > 0 ? (
                <div className="space-y-3">
                  {workCompleted.map((item: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{item.task}</p>
                        {item.details && (
                          <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work items recorded for this week</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Work */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                Upcoming Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingWork.length > 0 ? (
                <div className="space-y-3">
                  {upcomingWork.map((item: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{item.task}</p>
                        {item.timeline && (
                          <p className="text-sm text-gray-600 mt-1">
                            <Clock className="inline-block h-3 w-3 mr-1" />
                            {item.timeline}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming work scheduled</p>
              )}
            </CardContent>
          </Card>

          {/* Issues */}
          {issues.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Issues & Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {issues.map((issue: any, index: number) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{issue.description}</p>
                          {issue.impact && (
                            <p className="text-sm text-gray-600 mt-1">Impact: {issue.impact}</p>
                          )}
                          {issue.resolution && (
                            <p className="text-sm text-gray-600 mt-1">Resolution: {issue.resolution}</p>
                          )}
                        </div>
                        {issue.resolved && (
                          <Badge variant="secondary" className="ml-2">Resolved</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                Budget Status
              </CardTitle>
              <CardDescription>
                Current budget allocation and spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              {budget ? (
                <div className="space-y-4">
                  {budget.summary && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{budget.summary}</p>
                    </div>
                  )}
                  
                  {budget.items && budget.items.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-600 uppercase">Budget Breakdown</h4>
                      {budget.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between py-3 border-b">
                          <span className="font-medium">{item.category}</span>
                          <div className="text-right">
                            <span className="font-semibold">{item.spent}</span>
                            {item.budget && (
                              <span className="text-gray-500 ml-2">of {item.budget}</span>
                            )}
                            {item.variance && (
                              <span className={`ml-2 text-sm ${
                                item.variance.startsWith('+') ? 'text-red-600' : 'text-green-600'
                              }`}>
                                ({item.variance})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(budget.totalBudget || budget.totalSpent) && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <div>
                          {budget.totalSpent && <span>{budget.totalSpent}</span>}
                          {budget.totalBudget && (
                            <span className="text-gray-500 ml-2">of {budget.totalBudget}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No budget information available for this report</p>
              )}
            </CardContent>
          </Card>

          {/* Control Estimate */}
          {(report.ceTotal || report.ceContingency) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                  Control Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.ceProfessionalFees && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Professional Fees</span>
                      <span className="font-medium">{report.ceProfessionalFees}</span>
                    </div>
                  )}
                  {report.ceConstructionCosts && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Construction Costs</span>
                      <span className="font-medium">{report.ceConstructionCosts}</span>
                    </div>
                  )}
                  {report.ceOffsiteUtilities && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Offsite Utilities</span>
                      <span className="font-medium">{report.ceOffsiteUtilities}</span>
                    </div>
                  )}
                  {report.ceFFE && (
                    <div className="flex justify-between py-2 border-b">
                      <span>FF&E</span>
                      <span className="font-medium">{report.ceFFE}</span>
                    </div>
                  )}
                  {report.ceInsuranceFinancing && (
                    <div className="flex justify-between py-2 border-b">
                      <span>Insurance & Financing</span>
                      <span className="font-medium">{report.ceInsuranceFinancing}</span>
                    </div>
                  )}
                  {report.ceTotal && (
                    <div className="flex justify-between py-2 font-semibold">
                      <span>Total</span>
                      <span>{report.ceTotal}</span>
                    </div>
                  )}
                  {report.ceContingency && (
                    <div className="flex justify-between py-2">
                      <span>Contingency</span>
                      <span className="font-medium">{report.ceContingency}</span>
                    </div>
                  )}
                  {report.ceContingencyUsed && (
                    <div className="flex justify-between py-2">
                      <span>Contingency Used</span>
                      <span className="font-medium">{report.ceContingencyUsed}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                Progress Photos
              </CardTitle>
              <CardDescription>
                {report.photos.length} photos from this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {report.photos.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(photosByArea).map(([area, photos]: [string, any]) => (
                    <div key={area}>
                      <h4 className="font-semibold mb-3">{area}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo: any) => (
                          <div 
                            key={photo.id}
                            className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden"
                            onClick={() => setSelectedPhoto(photo)}
                          >
                            <img
                              src={photo.url}
                              alt="Progress photo"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                            {photo.tags && photo.tags.length > 0 && (
                              <div className="absolute bottom-2 left-2 right-2">
                                <div className="flex flex-wrap gap-1">
                                  {photo.tags.slice(0, 3).map((tag: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No photos available for this report</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" style={{ color: accentColor }} />
                Client Action Items
              </CardTitle>
              <CardDescription>
                Items requiring your attention or decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientActions.length > 0 ? (
                <div className="space-y-3">
                  {clientActions.map((action: any, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{action.action}</p>
                          {action.context && (
                            <p className="text-sm text-gray-600 mt-2">{action.context}</p>
                          )}
                          {action.dueDate && (
                            <p className="text-sm font-medium mt-2">
                              <Calendar className="inline-block h-3 w-3 mr-1" />
                              Due: {new Date(action.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {action.priority && (
                          <Badge 
                            variant={action.priority === 'high' ? 'destructive' : 'secondary'}
                            className="ml-2"
                          >
                            {action.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No action items for this week</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt="Full size photo"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}