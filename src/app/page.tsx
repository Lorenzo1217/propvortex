import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Camera, 
  Users, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  FileUp, 
  Brain,
  Check
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo2.svg" 
                  alt="PropVortex" 
                  width={150} 
                  height={40} 
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <Link href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Demo
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/signup?plan=professional">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            Trusted by luxury home builders ($10M+ estates)
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-light text-gray-900 tracking-wide mb-6">
            Your Builds Speak for Themselves.
            <br />
            <span className="font-normal">Your Reports Should Too.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create Goldman Sachs-quality construction reports in under 10 minutes. 
            PropVortex transforms your technical updates into stunning client experiences 
            that match the caliber of your luxury projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8" asChild>
              <Link href="/signup?plan=professional">Start Your Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <Link href="#demo">View Live Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            30-day free trial • No credit card required • Setup in under 5 minutes
          </p>
        </div>
      </section>

      {/* AI Automation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Automation
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              From Chaos to Client-Ready in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI suite transforms scattered updates into polished reports automatically
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Email Forwarding AI</CardTitle>
                <CardDescription>
                  Forward subcontractor emails and our AI extracts updates automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                  <FileUp className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Paste from Procore</CardTitle>
                <CardDescription>
                  Copy data from Procore and we'll format it perfectly for your reports
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">AI Writing Assistant</CardTitle>
                <CardDescription>
                  Transforms technical notes into clear, professional client updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Auto Notifications</CardTitle>
                <CardDescription>
                  Clients get notified when reports are ready with key highlights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 tracking-wide mb-6">
                Stop Losing Hours to Manual Reports
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-600">Spending 3-4 hours every week writing the same reports</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-600">Anxious clients calling for updates because reports are unclear</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-600">Reports that don't match the quality of your $10M+ projects</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-sm">✗</span>
                  </div>
                  <p className="text-gray-600">Scattered updates across email, texts, and project management tools</p>
                </div>
              </div>
            </div>
            <div>
              <Card className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">The PropVortex Solution</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Goldman Sachs-quality reports in under 10 minutes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">AI transforms Procore data into polished updates</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Branded client portals that match luxury expectations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Automated email digests keep clients informed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100">
              Live Demo
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              This is What Your Clients Will See
            </h2>
            <p className="text-xl text-gray-600">
              A premium, branded experience worthy of Highland Park estates
            </p>
          </div>
          
          <Card className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-5xl mx-auto">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">MB</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">Morrison Builders</CardTitle>
                    <CardDescription>The Henderson Estate • Highland Park</CardDescription>
                  </div>
                </div>
                <Badge className="bg-blue-50 text-blue-700">Week 24 Report</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Executive Summary */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-lg font-semibold">Executive Summary</h3>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Excellent progress this week on the Henderson Estate. Interior millwork installation 
                  is 85% complete, with the library and wine cellar finishing ahead of schedule. 
                  The imported Italian marble for the master bath has arrived and installation begins Monday. 
                  We remain on track for our Q3 completion target.
                </p>
              </div>

              <Separator className="my-6" />

              {/* Control Estimate Update */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Control Estimate Update</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Original Contract</span>
                      <span className="font-semibold">$12,750,000</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Approved Changes</span>
                      <span className="font-semibold text-green-600">+$425,000</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Current Contract</span>
                      <span className="font-semibold">$13,175,000</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-semibold">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Contingency Remaining</span>
                      <span className="font-semibold">$387,500</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Client Actions Required */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Client Actions Required</h3>
                  <Badge className="bg-yellow-50 text-yellow-700">2 Pending</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Master Suite Chandelier Selection</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Please select from the three options provided by the lighting designer. 
                        Decision needed by Friday to maintain schedule.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Pool House Cabinet Hardware</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Approval needed for $18,500 upgrade to Waterworks fixtures as discussed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Upcoming Work */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Upcoming Work (Next 2 Weeks)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Complete master bath marble installation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Install custom wine cellar cooling system</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Begin exterior limestone detail work</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Complete theater room acoustic panels</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Install smart home integration system</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">Pool house millwork installation</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Photo Gallery */}
              <div>
                <h3 className="text-lg font-semibold mb-4">This Week's Progress Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  12 photos uploaded this week • Click to view full gallery
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              Built for Luxury Home Builders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every feature designed to match the sophistication of your high-end projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle>AI-Powered Writing</CardTitle>
                <CardDescription>
                  Transform technical updates into eloquent narratives worthy of your clientele
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle>Financial Tracking</CardTitle>
                <CardDescription>
                  Real-time budget tracking with change order management and contingency monitoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <Camera className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle>Professional Photography</CardTitle>
                <CardDescription>
                  Showcase craftsmanship with high-res galleries, annotations, and progress comparisons
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <CardTitle>Branded Reports</CardTitle>
                <CardDescription>
                  Custom-branded PDF reports that reflect your company's premium positioning
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-teal-600" />
                </div>
                <CardTitle>Client Portal</CardTitle>
                <CardDescription>
                  Dedicated portals for each project with secure access and real-time updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader>
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-pink-600" />
                </div>
                <CardTitle>Portfolio Showcase</CardTitle>
                <CardDescription>
                  Turn completed projects into stunning marketing materials for future clients
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 30-day free trial. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional Plan */}
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-light">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-light">$149</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">Perfect for growing builders</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Up to 10 active projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited weekly reports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">AI writing assistant</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Photo galleries & annotations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Client portal access</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup?plan=professional">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Unlimited Plan */}
            <Card className="bg-white border-2 border-blue-500 rounded-lg relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-light">Unlimited</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-light">$349</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">For established luxury builders</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-semibold">Unlimited projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Everything in Professional</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Procore integration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Email forwarding AI</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Custom branding</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Priority phone support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                </ul>
                <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
                  <Link href="/signup?plan=unlimited">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-4">
            Ready to Elevate Your Client Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join luxury builders who are saving hours every week while delivering 
            Goldman Sachs-quality reports to their discerning clients.
          </p>
          <Button size="lg" variant="secondary" className="px-8" asChild>
            <Link href="/signup?plan=professional">
              Start Your 30-Day Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image 
                src="/logo2.svg" 
                alt="PropVortex" 
                width={150} 
                height={40} 
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 text-sm">
                Professional construction reporting for luxury home builders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2025 PropVortex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}