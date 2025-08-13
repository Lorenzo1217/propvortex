"use client"

import { useEffect } from 'react'
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
  FileUp, 
  Check,
  Calendar
} from "lucide-react"

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
                <Link href="/signup?plan=professional">Request Your Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gray-800 text-gray-200" variant="secondary">
                Trusted by luxury home builders ($10M+ estates)
              </Badge>
              <h1 className="text-5xl font-bold text-white mb-6 fade-in-up">
                Your Builds Speak for Themselves.
                <span className="block text-gray-300 mt-2">Your Reports Should Too.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-4 fade-in-up delay-100">
                Transform technical updates into stunning client reports in under 10 minutes.
              </p>
              <p className="text-lg text-gray-400 mb-8 fade-in-up delay-200">
                Built for luxury design-build firms delivering $2M–$10M+ custom homes.
              </p>
              <div className="flex gap-4 flex-col sm:flex-row mb-4 fade-in-up delay-300">
                <Link href="/signup?plan=professional" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-white text-black hover:bg-black hover:text-white transition-all duration-300 w-full">
                    Request Your 30-Day Free Trial
                  </Button>
                </Link>
                <Link href="#demo" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black transition-all duration-300">
                    View Live Demo
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-400">Setup in under 5 minutes</p>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg transform skew-y-0 -rotate-6 rounded-3xl"></div>
                <div className="relative bg-white shadow-xl rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Image 
                      src="/logo3.svg" 
                      alt="Morrison Builders" 
                      width={60} 
                      height={60} 
                      className="h-14 w-auto"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">Morrison Builders</p>
                      <p className="text-xs text-gray-600">Weekly Report • Week 24</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Project Progress</span>
                      <span className="text-xs font-semibold">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-800 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    AI-Enhanced • Professional PDF Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <div className="text-center py-8 bg-gray-50 border-y border-gray-200">
        <p className="text-sm text-gray-500 mb-4">Trusted by luxury builders in Dallas-Fort Worth</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <span className="text-gray-700 font-medium text-sm sm:text-base">BHDS Group</span>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Morrison Builders</span>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Luxury Estates Group</span>
          <span className="text-gray-700 font-medium text-sm sm:text-base">Vanguard Custom Homes</span>
        </div>
      </div>

      {/* AI Automation Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Image src="/logo2.svg" alt="PropVortex" width={80} height={80} className="h-16 w-auto opacity-80" />
            </div>
            <Badge className="mb-4 bg-gray-800 text-gray-200" variant="secondary">
              AI-Powered Automation
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 fade-in-up">
              From Chaos to Client-Ready in Minutes
            </h2>
            <p className="text-lg text-gray-600 fade-in-up delay-100">
              Our AI suite transforms scattered updates into polished reports automatically
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg text-white transform hover:scale-105 transition-all duration-300 fade-in-up delay-100">
              <Mail className="w-8 h-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">Email Forwarding AI</h3>
              <p className="text-sm text-gray-300">
                Forward subcontractor emails and our AI extracts updates automatically
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg text-white transform hover:scale-105 transition-all duration-300 fade-in-up delay-200">
              <FileUp className="w-8 h-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">Paste from Any Tool</h3>
              <p className="text-sm text-gray-300">
                Copy data from Excel, Procore, BuilderTrend, or MS Project. Upload PDFs like OAC meeting transcripts. AI reformats everything perfectly.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg text-white transform hover:scale-105 transition-all duration-300 fade-in-up delay-300">
              <Sparkles className="w-8 h-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">AI Writing Assistant</h3>
              <p className="text-sm text-gray-300">
                Transforms technical notes into clear, professional client updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 tracking-wide mb-8 text-center">
            Stop Losing Hours to Outdated Reporting
          </h2>

          {/* Before/After Visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                Before PropVortex
              </h4>
              <Card className="border border-red-200 bg-red-50/30">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Scattered email threads</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Inconsistent Word docs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">WhatsApp photo dumps</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">No central client hub</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                After PropVortex
              </h4>
              <Card className="border border-green-200 bg-green-50/30">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Branded client portal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Professional PDF reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Organized photo galleries</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">One source of truth</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  The PropVortex Solution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Institutional-quality reports in under 10 minutes</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">AI transforms Procore data into polished updates</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Branded client portals that match luxury expectations</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">Automated email digests keep clients informed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-50 text-green-700 hover:bg-green-100">
              Live Demo
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              This is What Your Clients Will See
            </h2>
            <p className="text-xl text-gray-600">
              A premium, branded experience worthy of multi-million dollar estates
            </p>
          </div>
          
          <Card className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-5xl mx-auto">
            <div className="bg-white px-8 py-4 border-b border-gray-200">
              <div className="text-center mb-3">
                <div className="flex justify-center mb-2">
                  <Image 
                    src="/logo3.svg" 
                    alt="Morrison Builders" 
                    width={120} 
                    height={120} 
                    className="h-24 w-auto"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">Morrison Builders</h3>
                <p className="text-sm text-gray-500">The Henderson Estate • Multi-Million Dollar Custom Home</p>
              </div>
              <div className="flex justify-center">
                <Badge className="bg-green-100 text-green-800">Week 24 Report</Badge>
              </div>
            </div>
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
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                  <h4 className="font-semibold text-gray-900">Client Actions Required</h4>
                  <Badge className="ml-2 bg-amber-100 text-amber-800">2 Pending</Badge>
                </div>
                <div className="space-y-3">
                  <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                          <p className="font-medium text-gray-900">Master Suite Chandelier Selection</p>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">Please select from the three options provided by the lighting designer. Decision needed by Friday to maintain schedule.</p>
                      </div>
                      <div className="ml-4 text-right">
                        <Badge variant="outline" className="text-amber-600 border-amber-600">Urgent</Badge>
                        <p className="text-xs text-gray-500 mt-1">Due Aug 8</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-white rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                          <p className="font-medium text-gray-900">Pool House Cabinet Hardware</p>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">Approval needed for $18,500 upgrade to Waterworks fixtures as discussed.</p>
                      </div>
                      <div className="ml-4 text-right">
                        <Badge variant="outline">Standard</Badge>
                        <p className="text-xs text-gray-500 mt-1">Due Aug 11</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Upcoming Work */}
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <h4 className="font-semibold text-gray-900">Upcoming Work (Next 2 Weeks)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Complete master bath marble installation</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Install custom wine cellar cooling system</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Begin exterior limestone detail work</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Complete theater room acoustic panels</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Install smart home integration system</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 bg-white rounded-lg p-3">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Pool house millwork installation</p>
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

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">What Luxury Builders Are Saying</h3>
          <Card className="border border-gray-200 p-8">
            <p className="text-lg text-gray-700 italic mb-4">
              "PropVortex transformed our client updates from a weekly headache into a 5-minute task. 
              Our homeowners love the reports, and our team saves hours every week. It's a must-have for luxury builds."
            </p>
            <div className="flex items-center justify-center mt-6">
              <div>
                <p className="font-semibold">Lawrence Barbara</p>
                <p className="text-sm text-gray-500">BHDS Group – Dallas, TX</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
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
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 30-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional Plan */}
            <Card className="bg-white border border-gray-200 rounded-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 fade-in-up delay-100">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-light">Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-light">$149</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">Perfect for boutique luxury builders</CardDescription>
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
                  <Link href="/signup?plan=professional">Request Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Unlimited Plan */}
            <Card className="bg-white border-2 border-blue-500 rounded-lg relative transform hover:scale-105 hover:shadow-2xl transition-all duration-300 fade-in-up delay-200">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-light">Unlimited</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-light">$349</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <CardDescription className="mt-2">For established design-build firms</CardDescription>
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
                    <span className="text-gray-700">AI document upload (PDFs, Excel, OAC transcripts)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Built-in CRM system</span>
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
                  <Link href="/signup?plan=unlimited">Request Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Phone Contact Banner */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full">
              <span className="text-sm text-gray-600">
                Questions? Call <a href="tel:2142336811" className="font-semibold text-gray-900 hover:text-blue-600">(214) 233-6811</a> to speak with a product expert
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 fade-in-up">
            Ready to Match the Quality Your Luxury Clients Expect?
          </h2>
          <p className="text-xl text-gray-300 mb-8 fade-in-up delay-100">
            Join exclusive luxury builders who are saving hours every week while
            delivering institutional-quality reports to their discerning clients.
          </p>
          <Link href="/signup?plan=professional" className="fade-in-up delay-200">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 transform hover:scale-110 transition-all duration-300">
              Request Your 30-Day Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6">
            30-day free trial • Cancel anytime
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
                Premium project reporting for luxury custom home builders and their clients.
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