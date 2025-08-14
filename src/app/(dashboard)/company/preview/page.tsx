import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ArrowLeft, Building2, Mail, FileText, 
  Monitor, Smartphone, Palette, Eye
} from 'lucide-react'
import ReportHeader from '@/components/report-header'
import PropVortexFooter from '@/components/propvortex-footer'

export default async function CompanyPreviewPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { companyRelation: true }
  })

  if (!user?.companyRelation) {
    redirect('/company/setup')
  }

  const company = user.companyRelation

  // Sample data for preview
  const sampleProject = {
    id: 'sample',
    name: 'Sample Project',
    address: '123 Main Street, Anytown, USA',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const sampleReport = {
    id: 'sample',
    title: 'Week 1 Progress Report',
    weekNumber: 1,
    year: 2024,
    executiveSummary: 'This week we completed the foundation work and began framing. The project is on schedule and within budget.',
    publishedAt: new Date(),
    isPublished: true,
    projectId: 'sample',
    createdAt: new Date(),
    updatedAt: new Date(),
    workCompleted: null,
    upcomingWork: null,
    issues: null,
    budget: null,
    clientActions: null,
    weatherData: null,
    weatherFetchedAt: null,
    ceProfessionalFees: null,
    ceConstructionCosts: null,
    ceOffsiteUtilities: null,
    ceFFE: null,
    ceInsuranceFinancing: null,
    ceTotal: null,
    ceContingency: null,
    ceContingencyUsed: null
  }

  const sampleClient = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/company/settings">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Company Settings
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Branding Preview</h1>
            <p className="text-gray-600 mt-2">
              See how your company branding appears to clients across the platform
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            <Eye className="mr-2 h-4 w-4" />
            Preview Mode
          </Badge>
        </div>
      </div>

      {/* Current Branding */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Current Branding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3">Company Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Name:</span>
                  <span className="font-medium">{company.name}</span>
                </div>
                {company.logoUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Logo:</span>
                    <img src={company.logoUrl} alt={company.name} className="h-8" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Brand Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Primary:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: company.primaryColor }}
                    />
                    <span className="font-mono text-sm">{company.primaryColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Secondary:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: company.secondaryColor }}
                    />
                    <span className="font-mono text-sm">{company.secondaryColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Accent:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: company.accentColor }}
                    />
                    <span className="font-mono text-sm">{company.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Tabs */}
      <Tabs defaultValue="portal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portal">
            <Monitor className="mr-2 h-4 w-4" />
            Client Portal
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileText className="mr-2 h-4 w-4" />
            Report Header
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Template
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile View
          </TabsTrigger>
        </TabsList>

        {/* Client Portal Preview */}
        <TabsContent value="portal">
          <Card>
            <CardHeader>
              <CardTitle>Client Portal Preview</CardTitle>
              <CardDescription>
                This is how clients see their dashboard with your branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Portal Header */}
                <div 
                  className="p-4 text-white"
                  style={{
                    backgroundColor: company.primaryColor,
                    borderTop: `4px solid ${company.accentColor}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="h-8 filter brightness-0 invert" />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-8 w-8" />
                          <span className="text-xl font-semibold">{company.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>John Doe</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        JD
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Portal Content */}
                <div className="p-6 bg-gray-50">
                  <h2 className="text-2xl font-bold mb-4">Welcome back, John!</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">Your Project</h3>
                      <p className="text-gray-600">Sample Project</p>
                      <Button 
                        className="mt-3"
                        style={{ backgroundColor: company.accentColor }}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-semibold mb-2">Latest Report</h3>
                      <p className="text-gray-600">Week 1 Progress Report</p>
                      <Button 
                        variant="outline"
                        className="mt-3"
                        style={{ 
                          borderColor: company.accentColor,
                          color: company.accentColor 
                        }}
                      >
                        Read Report
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* PropVortex Footer */}
                <PropVortexFooter />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Header Preview */}
        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle>Report Header Preview</CardTitle>
              <CardDescription>
                This header appears at the top of all client reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportHeader 
                company={company}
                project={sampleProject}
                report={sampleReport}
                isClientView={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Template Preview */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Template Preview</CardTitle>
              <CardDescription>
                Sample welcome email with your branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-gray-100 p-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Email Header */}
                  <div 
                    className="p-8 text-center text-white"
                    style={{ backgroundColor: company.primaryColor }}
                  >
                    {company.logoUrl ? (
                      <img 
                        src={company.logoUrl} 
                        alt={company.name}
                        className="h-12 mx-auto mb-4 filter brightness-0 invert"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{company.name}</h1>
                    )}
                  </div>
                  
                  {/* Email Content */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Your Project Portal!</h2>
                    <p className="text-gray-600 mb-4">
                      Dear {sampleClient.firstName} {sampleClient.lastName},
                    </p>
                    <p className="text-gray-600 mb-6">
                      We're excited to have you as part of the Sample Project! 
                      Your dedicated project portal is now ready.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <Button 
                        className="w-full"
                        style={{ backgroundColor: company.accentColor }}
                      >
                        Set Up Password
                      </Button>
                    </div>
                  </div>
                  
                  {/* Email Footer */}
                  <div className="bg-gray-50 p-6 text-center text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
                    <p className="mt-2">
                      Made with <a href="https://propvortex.com" className="text-blue-600">PropVortex</a> • Construction Project Management
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mobile View Preview */}
        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle>Mobile View Preview</CardTitle>
              <CardDescription>
                How your branding appears on mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto">
                <div className="border-8 border-gray-800 rounded-3xl overflow-hidden">
                  <div className="bg-white">
                    {/* Mobile Header */}
                    <div 
                      className="p-4 text-white"
                      style={{
                        backgroundColor: company.primaryColor,
                        borderTop: `4px solid ${company.accentColor}`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="h-6 filter brightness-0 invert" />
                        ) : (
                          <span className="font-semibold">{company.name}</span>
                        )}
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                      </div>
                    </div>
                    
                    {/* Mobile Content */}
                    <div className="p-4 bg-gray-50 min-h-[400px]">
                      <h2 className="text-lg font-bold mb-3">Welcome back!</h2>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border">
                          <p className="font-medium text-sm">Sample Project</p>
                          <p className="text-xs text-gray-500 mt-1">Week 1 Report Available</p>
                        </div>
                        <Button 
                          className="w-full text-sm"
                          size="sm"
                          style={{ backgroundColor: company.accentColor }}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                    
                    {/* Mobile Footer */}
                    <div className="p-3 text-center text-xs text-gray-500 border-t">
                      Made with PropVortex
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}