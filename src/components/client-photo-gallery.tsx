'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PhotoSearchBar } from '@/components/photo-search-bar'
import { PhotoLightbox } from '@/components/photo-lightbox'
import { parseTags, getTagBadgeColor } from '@/config/photo-tags'
import { Camera, Calendar, FileText, ZoomIn, Grid3x3, List } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Photo {
  id: string
  url: string
  originalName: string
  caption: string | null
  tags: string | null
  uploadedAt: Date
  report?: {
    id: string
    title: string
    weekNumber: number
    year: number
    publishedAt: Date | null
  } | null
}

interface ClientPhotoGalleryProps {
  photos: Photo[]
  projectName?: string
}

type GroupBy = 'all' | 'report' | 'month'
type ViewMode = 'grid' | 'list'

export function ClientPhotoGallery({ photos, projectName = "Project" }: ClientPhotoGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<GroupBy>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  // Filter photos based on search and tags
  const filteredPhotos = useMemo(() => {
    let filtered = photos

    // Filter by search term (searches in caption and original name)
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.caption && photo.caption.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(photo => {
        const photoTags = parseTags(photo.tags)
        return selectedTags.some(tag => photoTags.includes(tag))
      })
    }

    return filtered
  }, [photos, searchTerm, selectedTags])

  // Group photos based on groupBy setting
  const groupedPhotos = useMemo(() => {
    if (groupBy === 'all') {
      return { 'All Photos': filteredPhotos }
    }

    if (groupBy === 'report') {
      const groups: Record<string, Photo[]> = {}
      filteredPhotos.forEach(photo => {
        const key = photo.report 
          ? `${photo.report.title} (Week ${photo.report.weekNumber}, ${photo.report.year})`
          : 'No Report'
        if (!groups[key]) groups[key] = []
        groups[key].push(photo)
      })
      return groups
    }

    if (groupBy === 'month') {
      const groups: Record<string, Photo[]> = {}
      filteredPhotos.forEach(photo => {
        const date = new Date(photo.uploadedAt)
        const key = format(date, 'MMMM yyyy')
        if (!groups[key]) groups[key] = []
        groups[key].push(photo)
      })
      return groups
    }

    return { 'All Photos': filteredPhotos }
  }, [filteredPhotos, groupBy])

  const handleSearch = (term: string, tags: string[]) => {
    setSearchTerm(term)
    setSelectedTags(tags)
  }

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
  }

  const allFilteredPhotosFlat = Object.values(groupedPhotos).flat()

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Yet</h3>
            <p className="text-gray-500">
              Photos from published reports will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {projectName} Photo Gallery
            </CardTitle>
            <div className="flex items-center gap-2">
              <select 
                value={groupBy} 
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Photos</option>
                <option value="report">By Report</option>
                <option value="month">By Month</option>
              </select>
              <div className="flex rounded-md shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PhotoSearchBar onSearch={handleSearch} className="mb-6" />
          
          <div className="text-sm text-gray-600 mb-4">
            Found {allFilteredPhotosFlat.length} photo{allFilteredPhotosFlat.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedTags.length > 0 && ` with selected tags`}
          </div>

          {Object.entries(groupedPhotos).map(([groupName, groupPhotos]) => (
            <div key={groupName} className="mb-8">
              {groupBy !== 'all' && (
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {groupName}
                  <span className="text-sm text-gray-500">({groupPhotos.length})</span>
                </h3>
              )}

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupPhotos.map((photo, index) => {
                    const tags = parseTags(photo.tags)
                    const photoIndex = allFilteredPhotosFlat.indexOf(photo)
                    
                    return (
                      <div
                        key={photo.id}
                        className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => openLightbox(photoIndex)}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={photo.url}
                            alt={photo.originalName}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                              <ZoomIn className="w-5 h-5 text-gray-800" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 space-y-2">
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.slice(0, 3).map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className={`${getTagBadgeColor(tag)} text-xs px-2 py-0`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs px-2 py-0">
                                  +{tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {photo.caption && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {photo.caption}
                            </p>
                          )}
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(photo.uploadedAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {groupPhotos.map((photo) => {
                    const tags = parseTags(photo.tags)
                    const photoIndex = allFilteredPhotosFlat.indexOf(photo)
                    
                    return (
                      <div
                        key={photo.id}
                        className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openLightbox(photoIndex)}
                      >
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={photo.url}
                            alt={photo.originalName}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm truncate">
                              {photo.originalName}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {format(new Date(photo.uploadedAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {photo.caption && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {photo.caption}
                            </p>
                          )}
                          
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.map(tag => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className={`${getTagBadgeColor(tag)} text-xs px-2 py-0`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {photo.report && (
                            <p className="text-xs text-gray-500 mt-2">
                              From: {photo.report.title}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}

          {allFilteredPhotosFlat.length === 0 && (
            <div className="text-center py-12">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Found</h3>
              <p className="text-gray-500">
                Try adjusting your search filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photos={allFilteredPhotosFlat.map(photo => ({
          id: photo.id,
          url: photo.url,
          originalName: photo.originalName,
          caption: photo.caption,
          uploadedAt: photo.uploadedAt
        }))}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}