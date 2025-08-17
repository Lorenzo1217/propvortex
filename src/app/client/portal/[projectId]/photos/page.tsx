import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Building2, Camera, Calendar, MapPin, Image as ImageIcon, Home } from 'lucide-react'
import { PhotosClient } from './photos-client'
import { parseTags } from '@/config/photo-tags'

export default async function ClientPortalPhotosPage({ 
  params 
}: { 
  params: Promise<{ projectId: string }> 
}) {
  const { projectId } = await params
  
  // Fetch project with photos from published reports only and company data
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        include: {
          companyRelation: true
        }
      },
      photos: {
        where: {
          report: {
            isPublished: true  // Only photos from published reports
          }
        },
        orderBy: { uploadedAt: 'desc' },
        include: {
          report: {
            select: {
              weekNumber: true,
              year: true,
              title: true,
              isPublished: true
            }
          }
        }
      },
      _count: {
        select: {
          reports: {
            where: { isPublished: true }
          }
        }
      }
    }
  })
  
  if (!project) {
    return notFound()
  }

  const company = project.user.companyRelation
  
  // Get brand colors from company settings
  const primaryColor = company?.primaryColor || '#000000'
  const secondaryColor = company?.secondaryColor || '#666666'
  const accentColor = company?.accentColor || '#3B82F6'
  
  // Process photos to parse tags
  const processedPhotos = project.photos.map(photo => ({
    ...photo,
    parsedTags: parseTags(photo.tags)
  }))
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 space-y-6">
        {/* Project Header - Match main portal style */}
        <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
          <div 
            className="border-b px-8 py-6"
            style={{
              background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
              borderBottomColor: secondaryColor
            }}
          >
            {/* Company Branding */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {company?.logoUrl ? (
                  <img 
                    src={company.logoUrl} 
                    alt={company?.name || 'Builder'}
                    className="h-12 w-auto max-w-[200px]"
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-10 w-10" style={{ color: primaryColor }} />
                    <span className="text-xl font-semibold" style={{ color: primaryColor }}>
                      {company?.name || 'Your Builder'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Link 
                  href={`/client/portal/${projectId}`}
                  className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm border"
                  style={{ borderColor: secondaryColor }}
                  title="Portal Home"
                >
                  <Home 
                    className="h-5 w-5" 
                    style={{ color: primaryColor }}
                  />
                </Link>
                <Badge variant="secondary">
                  {project.photos.length} Photos
                </Badge>
              </div>
            </div>
            
            {/* Project Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name} - Project Photos
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.address}
                  {project.city && `, ${project.city}, ${project.state} ${project.zipCode}`}
                </div>
                <div className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  {project.photos.length} Total Photos
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Bar */}
          <CardContent className="px-8 py-4">
            <div className="flex flex-wrap gap-3">
              <Link href={`/client/portal/${projectId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </Button>
              </Link>
              <Link href={`/client/portal/${projectId}/reports`}>
                <Button variant="outline">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Photos Section */}
        {project.photos.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50">
            <CardContent className="py-12 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No photos uploaded yet</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon for project photos</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
            <CardHeader 
              className="border-b px-8 py-6"
              style={{
                background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}05)`,
                borderBottomColor: secondaryColor
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${accentColor}20` }}>
                    <Camera className="w-5 h-5" style={{ color: accentColor }} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                      Progress Photos
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Click any photo to view full size
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Latest: {new Date(project.photos[0].uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-8 py-6">
              <PhotosClient 
                photos={processedPhotos}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}