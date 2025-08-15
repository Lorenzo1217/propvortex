import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, AlertCircle } from 'lucide-react'

export default async function ClientPortalLanding() {
  // This is the landing page when no project ID is provided
  // Show a message that they need a direct link from their builder
  
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Client Portal Access
          </CardTitle>
          <CardDescription>
            Welcome to the PropVortex Client Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Direct Link Required</p>
                <p>
                  To access your project portal, you need to use the direct link 
                  provided by your builder. This link will give you access to:
                </p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Weekly progress reports</li>
                  <li>Project photos and updates</li>
                  <li>Budget and timeline information</li>
                  <li>Important action items</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              If you haven't received your portal link, please contact your builder directly.
            </p>
            <Link href="/client/login">
              <Button variant="outline" className="w-full">
                Have an account? Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}