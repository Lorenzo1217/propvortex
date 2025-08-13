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
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  FileUp, 
  Check,
  Quote,
  Clock
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
                  <Button size="lg" className="bg-white text-black hover:bg-black hover:text-white transition-all duration-300 w-full">
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
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 fade-in-up">
              Stop Losing Hours to Outdated Reporting
            </h2>
            <p className="text-xl text-gray-600 fade-in-up delay-100">
              Transform your workflow from chaos to clarity
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Before Column */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 fade-in-up delay-200">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 text-red-500 mr-3">✕</div>
                <h3 className="text-2xl font-bold text-gray-900">Before PropVortex</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✕</span>
                  <span className="text-gray-700">Scattered email threads</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✕</span>
                  <span className="text-gray-700">Inconsistent Word docs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✕</span>
                  <span className="text-gray-700">WhatsApp photo dumps</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">✕</span>
                  <span className="text-gray-700">No central client hub</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-red-600 font-semibold">The Problem:</p>
                <p className="text-gray-700 mt-2">• Spending 3-4 hours every week writing the same reports</p>
                <p className="text-gray-700 mt-2">• Anxious clients calling for updates because reports are unclear</p>
                <p className="text-gray-700 mt-2">• Reports that don't match the quality of your $10M+ projects</p>
                <p className="text-gray-700 mt-2">• Scattered updates across email, texts, and project management tools</p>
              </div>
            </div>
            
            {/* After Column */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 fade-in-up delay-300">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">After PropVortex</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Branded client portal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Professional PDF reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">Organized photo galleries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <span className="text-gray-700">One source of truth</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-green-600 font-semibold">The PropVortex Solution:</p>
                <p className="text-gray-700 mt-2">• Institutional-quality reports in under 10 minutes</p>
                <p className="text-gray-700 mt-2">• AI transforms Procore data into polished updates</p>
                <p className="text-gray-700 mt-2">• Branded client portals that match luxury expectations</p>
                <p className="text-gray-700 mt-2">• Automated email digests keep clients informed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Luxury Home Builders Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 fade-in-up">
              Built for Luxury Home Builders
            </h2>
            <p className="text-xl text-gray-300 fade-in-up delay-100">
              Every feature designed to match the sophistication of your high-end projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-100">
              <Sparkles className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI-Powered Writing</h3>
              <p className="text-gray-300">
                Transform technical updates into eloquent narratives worthy of your clientele
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-200">
              <DollarSign className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Financial Tracking</h3>
              <p className="text-gray-300">
                Real-time budget tracking with change order management and contingency monitoring
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-300">
              <Camera className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Professional Photography</h3>
              <p className="text-gray-300">
                Showcase craftsmanship with high-res galleries, annotations, and progress comparisons
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-400">
              <FileText className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Branded Reports</h3>
              <p className="text-gray-300">
                Custom-branded PDF reports that reflect your company's premium positioning
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-500">
              <Users className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Client Portal</h3>
              <p className="text-gray-300">
                Dedicated portals for each project with secure access and real-time updates
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 fade-in-up delay-500">
              <TrendingUp className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Portfolio Showcase</h3>
              <p className="text-gray-300">
                Turn completed projects into stunning marketing materials for future clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gray-800 text-gray-200" variant="secondary">
              Live Demo
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              This is What Your Clients Will See
            </h2>
            <p className="text-xl text-gray-600">
              A premium, branded experience worthy of multi-million dollar estates
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto max-w-4xl">
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-200">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Image 
                    src="/logo3.svg" 
                    alt="Morrison Builders" 
                    width={140} 
                    height={140} 
                    className="h-32 w-auto"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-xl">Morrison Builders</h3>
                <p className="text-sm text-gray-500">The Henderson Estate</p>
              </div>
              <div className="flex justify-center mt-4">
                <Badge className="bg-green-100 text-green-800">Week 24 Report</Badge>
              </div>
            </div>
            
            {/* Report Content */}
            <div className="p-8 space-y-8">
              {/* Executive Summary */}
              <div>
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Executive Summary</h4>
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">AI Enhanced</Badge>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Excellent progress this week on the Henderson Estate. Interior millwork installation is 85% complete, with the library and wine cellar finishing ahead of schedule. The imported Italian marble for the master bath has arrived and installation begins Monday. We remain on track for our Q3 completion target.
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-gray-900">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              {/* Work Completed This Week */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Work Completed This Week</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Completed master bath marble installation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Installed custom wine cellar cooling system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Finished exterior limestone detail work</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Completed theater room acoustic panels</span>
                  </li>
                </ul>
              </div>

              {/* Upcoming Work */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Work (Next 2 Weeks)</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Begin pool house millwork installation</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Install smart home integration system</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Complete theater room projector calibration</span>
                  </li>
                </ul>
              </div>

              {/* Budget Update */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Budget Update</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Contract</span>
                    <span className="font-semibold text-gray-900">$12,750,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Approved Changes</span>
                    <span className="font-semibold text-green-600">+$425,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Contract</span>
                    <span className="font-semibold text-gray-900">$13,175,000</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Contingency Remaining</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">$387,500</span>
                        <span className="text-xs text-gray-500 block">3% of budget</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Actions Required */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">Client Actions Required</h4>
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">2 Pending</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-yellow-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Master Suite Chandelier Selection</p>
                      <p className="text-sm text-gray-600">Please select from the three options provided by the lighting designer.</p>
                      <p className="text-xs text-yellow-700 mt-1 font-medium">Due: Aug 8</p>
                    </div>
                    <Button size="sm" variant="outline" className="ml-4">
                      Urgent
                    </Button>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Pool House Cabinet Hardware</p>
                      <p className="text-sm text-gray-600">Approval needed for $16,500 upgrade to Waterworks fixtures.</p>
                      <p className="text-xs text-gray-500 mt-1">Due: Aug 11</p>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-4">
                      Standard
                    </Button>
                  </div>
                </div>
              </div>

              {/* This Week's Progress Photos */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">This Week's Progress Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">12 photos uploaded this week • Click to view full gallery</p>
              </div>

              {/* Weather Impact */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Weather Outlook</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">No weather delays expected.</span> Clear conditions forecasted for the next 7 days. Ideal for exterior work completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-12">
              What Luxury Builders Are Saying
            </h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <Quote className="w-12 h-12 text-gray-400 mx-auto mb-6" />
              <p className="text-xl text-gray-200 italic mb-8 leading-relaxed">
                "PropVortex transformed our client updates from a weekly headache into a 5-minute task. 
                Our homeowners love the reports, and our team saves hours every week. It's a must-have for 
                luxury builds."
              </p>
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold text-lg">Lawrence Barbara</p>
                <p className="text-gray-400">BHDS Group – Dallas, TX</p>
              </div>
            </div>
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
            <Card className="bg-white border-2 border-gray-900 rounded-lg relative transform hover:scale-105 hover:shadow-2xl transition-all duration-300 fade-in-up delay-200">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-black text-white">
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