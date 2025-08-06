// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Users, FileText, Smartphone, Zap, Camera, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl">PropVortex</span>
          </div>
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
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/pricing">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Trusted by builders in Dallas-Fort Worth
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Your Builds Speak for Themselves.
            <br />
            <span className="text-blue-600">Your Reports Should Too.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop spending hours on weekly reports. PropVortex transforms your project updates into 
            stunning, AI-enhanced client experiences that impress homeowners and win you more business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/pricing">Start Your Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="#demo">View Live Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 30-day free trial • Setup in under 5 minutes
          </p>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
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
                  <p className="text-gray-600">Missed opportunities to showcase your professionalism</p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">The PropVortex Solution</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>AI-enhanced reports in under 10 minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>Branded client portals that impress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>Portfolio showcases that win new business</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Impress Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              PropVortex isn't just a reporting tool—it's your competitive advantage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>AI-Enhanced Writing</CardTitle>
                <CardDescription>
                  Transform your technical notes into clear, professional updates that homeowners love
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Branded Client Portals</CardTitle>
                <CardDescription>
                  Give each client a premium, mobile-friendly portal with your branding front and center
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Interactive Photo Galleries</CardTitle>
                <CardDescription>
                  Annotated photos, before/after sliders, and organized galleries by room and date
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Professional PDF Reports</CardTitle>
                <CardDescription>
                  One-click generation of stunning PDF reports that clients can save and share
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Client Approval Workflows</CardTitle>
                <CardDescription>
                  Streamlined decision-making with timestamped approvals and change order tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Portfolio Showcase Generator</CardTitle>
                <CardDescription>
                  Turn completed projects into beautiful marketing pages that win you new clients
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start with a 30-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="text-4xl font-bold">$149<span className="text-lg text-gray-500">/mo</span></div>
                <CardDescription>Up to 10 projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Up to 10 active projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unlimited reports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Photo uploads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Weather integration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Client access portal</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/pricing">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Unlimited - Popular */}
            <Card className="border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Unlimited</CardTitle>
                <div className="text-4xl font-bold">$349<span className="text-lg text-gray-500">/mo</span></div>
                <CardDescription>Unlimited projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Unlimited reports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Photo uploads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Weather integration</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Client access portal</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Custom branding</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/pricing">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              See PropVortex in Action
            </h2>
            <p className="text-xl text-gray-600">
              This is what your clients will see - a premium, branded experience
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AB</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Austin Builders Co.</h3>
                  <p className="text-gray-500">The Smith Family Residence</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Project Timeline</h4>
                <div className="flex items-center space-x-4 overflow-x-auto">
                  <div className="flex flex-col items-center space-y-2 min-w-0">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-center">Foundation</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-green-500"></div>
                  <div className="flex flex-col items-center space-y-2 min-w-0">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-center">Framing</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-blue-500"></div>
                  <div className="flex flex-col items-center space-y-2 min-w-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⏳</span>
                    </div>
                    <span className="text-sm text-center">Electrical</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-gray-300"></div>
                  <div className="flex flex-col items-center space-y-2 min-w-0">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">○</span>
                    </div>
                    <span className="text-sm text-center">Drywall</span>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">This Week's Progress</h4>
                  <p className="text-gray-600 text-sm">
                    Great progress this week! We completed the rough electrical work and passed 
                    inspection. The team is now preparing for insulation installation next week.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recent Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="aspect-square bg-gray-200 rounded"></div>
                    <div className="aspect-square bg-gray-200 rounded"></div>
                    <div className="aspect-square bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Impress Your Next Client?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join builders across Texas who are saving hours and winning more business with PropVortex
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/pricing">Start Your Free Trial Today</Link>
          </Button>
          <p className="text-sm mt-4 opacity-75">
            30-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl">PropVortex</span>
              </div>
              <p className="text-gray-400 text-sm">
                The client experience platform built specifically for residential home builders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 PropVortex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}