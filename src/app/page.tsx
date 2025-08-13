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
  Clock,
  Cloud,
  Sun,
  CloudRain,
  ZoomIn,
  ChevronRight
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

      {/* Live Demo Section - Complete Weekly Report */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-up">
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
          
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto max-w-4xl fade-in-up delay-200">
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
                <p className="text-xs text-gray-400 mt-1">1234 Estate Drive, Highland Park, TX 75205</p>
              </div>
              <div className="flex justify-center mt-4 gap-2">
                <Badge className="bg-green-100 text-green-800">Week 32</Badge>
                <Badge className="bg-blue-100 text-blue-800">Published</Badge>
              </div>
            </div>
            
            {/* Report Content - EXACT ORDER FROM REAL REPORTS */}
            <div className="p-8 space-y-6">
              
              {/* 1. Weather Outlook */}
              <div className="bg-white rounded-lg shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-light tracking-wide text-gray-900">Weather Outlook</h3>
                      <p className="text-sm text-gray-500 mt-1">7-day forecast for construction planning • Weather conditions as of report creation</p>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-6">
                  {/* Weather grid - centered and professional */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-7 gap-2 max-w-6xl">
                      {/* Thursday - Hot with delay */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Thu</p>
                          <p className="text-xs text-gray-500">8/7</p>
                          <Badge variant="outline" className="mt-1 text-xs py-0 px-1">Report Date</Badge>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Sun className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">104°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">91°</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <p className="text-xs text-red-600 font-medium">Possible Delays</p>
                        </div>
                      </div>
                      
                      {/* Friday - Hot */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Fri</p>
                          <p className="text-xs text-gray-500">8/8</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Sun className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">102°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">89°</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <p className="text-xs text-red-600 font-medium">Possible Delays</p>
                        </div>
                      </div>
                      
                      {/* Saturday - Rain */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Sat</p>
                          <p className="text-xs text-gray-500">8/9</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <CloudRain className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">95°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">78°</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <p className="text-xs text-red-600 font-medium">Possible Delays</p>
                        </div>
                      </div>
                      
                      {/* Sunday - Cloudy */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-200 bg-white transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Sun</p>
                          <p className="text-xs text-gray-500">8/10</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Cloud className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">98°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">82°</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Monday - Hot */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Mon</p>
                          <p className="text-xs text-gray-500">8/11</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Sun className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">101°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">87°</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <p className="text-xs text-red-600 font-medium">Possible Delays</p>
                        </div>
                      </div>
                      
                      {/* Tuesday - Very Hot */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-300 bg-gray-50 shadow-sm transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Tue</p>
                          <p className="text-xs text-gray-500">8/12</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Sun className="w-10 h-10 text-gray-700" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">103°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">90°</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200 text-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto mb-0.5" />
                          <p className="text-xs text-red-600 font-medium">Possible Delays</p>
                        </div>
                      </div>
                      
                      {/* Wednesday - Partly Cloudy */}
                      <div className="flex flex-col p-3 rounded-lg border border-gray-200 bg-white transition-all min-w-[100px]">
                        <div className="text-center mb-2">
                          <p className="font-semibold text-sm text-gray-900">Wed</p>
                          <p className="text-xs text-gray-500">8/13</p>
                        </div>
                        <div className="flex justify-center mb-3">
                          <Cloud className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="flex items-center justify-center space-x-1">
                            <span className="text-lg font-semibold">99°</span>
                            <span className="text-sm text-gray-400">/</span>
                            <span className="text-sm text-gray-500">85°</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Project Photography */}
              <div className="bg-white rounded-lg shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Camera className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-light tracking-wide text-gray-900">Project Photography</h3>
                        <p className="text-gray-600 mt-1">6 photos documenting this week's progress</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1.5 bg-gray-100 text-gray-700 border-0">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Click to view</span>
                    </Badge>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Executive Summary */}
              <div className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-gray-900">Executive Summary</h3>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <p className="text-gray-700 leading-relaxed prose prose-gray max-w-none">
                    This week, we made great progress across the project. The custom bookcases and stone tile around 
                    the fireplace were installed, and the backyard patio steps were completed. Everything is tracking 
                    on schedule, and we're preparing for the next phase of interior finishes.
                  </p>
                </div>
              </div>

              {/* 4. Work Completed This Week */}
              <div className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-gray-900">Work Completed This Week</h3>
                  </div>
                </div>
                <div className="px-8 py-6">
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Installed backyard stone patio steps and completed final grading</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-700">Moderate Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Set and secured custom built-in wall bookcases in living room</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-700">Moderate Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Completed electrical rough-in inspection and passed city approval</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-xs font-medium tracking-wide text-blue-700">Critical Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Upcoming Work */}
              <div className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-gray-900">Upcoming Work</h3>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="space-y-4">
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Begin interior painting throughout main living areas</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-600">Minor Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Install kitchen cabinetry and prep for countertop templating</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-700">Moderate Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="group relative">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-400 transition-colors duration-300"></div>
                      <div className="pl-6 pb-4">
                        <div className="flex items-start justify-between gap-4 bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 leading-relaxed flex-1">Schedule HVAC final inspection and perform system testing</p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-xs font-medium tracking-wide text-blue-700">Critical Impact</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Issues & Delays */}
              <div className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-light tracking-wide text-gray-900">Issues & Delays</h3>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="space-y-6">
                    <div className="group">
                      <div className="bg-gray-50/50 rounded-lg p-5 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <p className="text-gray-700 leading-relaxed flex-1 font-light">
                            Stone Tile Delivery Delay
                          </p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-600">Low Risk</span>
                          </div>
                        </div>
                        <div className="mt-3 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Impact Analysis:</span> Minor 2-day delay; no impact on overall schedule
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <div className="bg-gray-50/50 rounded-lg p-5 hover:bg-gray-50 transition-all duration-200">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <p className="text-gray-700 leading-relaxed flex-1 font-light">
                            Cabinet Hardware Shipment Delay
                          </p>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                            <span className="text-xs font-medium tracking-wide text-gray-700">Medium Risk</span>
                          </div>
                        </div>
                        <div className="mt-3 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Impact Analysis:</span> May delay cabinet installation if not resolved
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Budget & Change Orders */}
              <div className="bg-white rounded-lg shadow-lg shadow-gray-100/50 p-6">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 -m-6 mb-4 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-light tracking-wide text-gray-900">Budget & Change Orders</h3>
                    </div>
                    <Badge className="bg-red-100 text-red-700">Net: $3,130 Over</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Upgrade to Stone Fireplace Surround</p>
                      <p className="text-xs text-gray-500">Change Order</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">$2,750</p>
                      <Badge className="text-xs bg-green-100 text-green-700">Approved</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">Bulk Purchase Discount on Flooring</p>
                      <p className="text-xs text-gray-500">Cost Savings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">-$600</p>
                      <Badge className="text-xs bg-yellow-100 text-yellow-700">Pending</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Control Estimate Update */}
              <div className="bg-white rounded-lg shadow-lg shadow-gray-100/50 p-6">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 -m-6 mb-4 rounded-t-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-light tracking-wide text-gray-900">Control Estimate Update</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-2">
                    <span className="text-gray-600">Professional Fees</span>
                    <span className="font-semibold text-gray-900">$1,936</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-gray-600">Construction Costs</span>
                    <span className="font-semibold text-gray-900">$2,344,446</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-gray-600">Insurance & Financing</span>
                    <span className="font-semibold text-gray-900">$2,000,000</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Project Total</span>
                      <span className="font-bold text-xl text-gray-900">$12,351,345</span>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 mt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">CONTINGENCY TRACKING</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-bold text-green-600">$14,511,108</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 9. Client Actions Required */}
              <div className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-light tracking-wide text-gray-900">Client Actions Required</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">2 Pending</span>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-6">
                  <div className="space-y-5">
                    <div className="group">
                      <div className="rounded-lg border bg-white border-gray-200 hover:border-gray-300 hover:shadow-md p-5 transition-all duration-200">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 space-y-3">
                            <p className="leading-relaxed text-gray-700">
                              Confirm outdoor lighting placement for front entrance and landscape areas
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <div className="p-1 bg-gray-100 rounded">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-light">Selection Required</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Due Aug 8</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50">
                              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                              <span className="text-xs font-medium tracking-wide text-blue-700">Urgent</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="group">
                      <div className="rounded-lg border bg-white border-gray-200 hover:border-gray-300 hover:shadow-md p-5 transition-all duration-200">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 space-y-3">
                            <p className="leading-relaxed text-gray-700">
                              Review and approve master bathroom tile selection from provided samples
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <div className="p-1 bg-gray-100 rounded">
                                  <Users className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-light">Approval Required</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Due Aug 11</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50">
                              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                              <span className="text-xs font-medium tracking-wide text-gray-700">Standard</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* End of report content */}
          </div>{/* End of white rounded container */}
        </div>{/* End of max-width container */}
      </section>{/* End of demo section */}

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