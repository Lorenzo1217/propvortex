'use client'

import { PhotoViewer } from "@/components/photo-viewer"
import { useState, useMemo } from "react"
import { Search, Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Photo {
  id: string
  url: string
  originalName: string
  caption?: string | null
  uploadedAt: Date
  tags?: string | null
  parsedTags?: string[]
}

interface PhotosClientProps {
  photos: Photo[]
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export function PhotosClient({ 
  photos, 
  primaryColor, 
  secondaryColor, 
  accentColor 
}: PhotosClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique tags from all photos
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    photos.forEach(photo => {
      if (photo.parsedTags) {
        photo.parsedTags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [photos])

  // Filter photos based on search and selected tag
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      // Search filter
      const matchesSearch = !searchTerm || 
        photo.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.parsedTags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      // Tag filter
      const matchesTag = !selectedTag || 
        photo.parsedTags?.includes(selectedTag)
      
      return matchesSearch && matchesTag
    })
  }, [photos, searchTerm, selectedTag])

  // Group photos by month for better organization
  const photosByMonth = useMemo(() => {
    const grouped = new Map<string, Photo[]>()
    
    filteredPhotos.forEach(photo => {
      const date = new Date(photo.uploadedAt)
      const monthKey = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, [])
      }
      grouped.get(monthKey)!.push(photo)
    })
    
    return Array.from(grouped.entries())
  }, [filteredPhotos])

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search photos by caption, filename, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
              style={{ 
                borderColor: secondaryColor,
                '--tw-ring-color': primaryColor
              } as any}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            style={{ 
              borderColor: secondaryColor,
              color: showFilters ? primaryColor : undefined
            }}
          >
            <Filter className="h-4 w-4" />
            <span>Filter by Tag</span>
            {selectedTag && (
              <Badge 
                variant="secondary" 
                className="ml-1"
                style={{ 
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor 
                }}
              >
                1
              </Badge>
            )}
          </button>
        </div>

        {/* Tag Filters */}
        {showFilters && allTags.length > 0 && (
          <div className="p-4 border rounded-lg bg-gray-50" style={{ borderColor: secondaryColor }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Filter by Category</p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-sm hover:underline"
                  style={{ color: primaryColor }}
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag 
                      ? 'text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-700 border'
                  }`}
                  style={selectedTag === tag ? {
                    backgroundColor: primaryColor
                  } : {
                    borderColor: secondaryColor
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredPhotos.length === photos.length ? (
            <span>Showing all {photos.length} photos</span>
          ) : (
            <span>
              Showing {filteredPhotos.length} of {photos.length} photos
              {(searchTerm || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedTag(null)
                  }}
                  className="ml-2 text-xs hover:underline"
                  style={{ color: primaryColor }}
                >
                  Clear all filters
                </button>
              )}
            </span>
          )}
        </p>
      </div>

      {/* Photos Display */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No photos match your search criteria</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedTag(null)
            }}
            className="mt-2 text-sm hover:underline"
            style={{ color: primaryColor }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Group by month if there are many photos */}
          {photosByMonth.length > 1 ? (
            photosByMonth.map(([month, monthPhotos]) => (
              <div key={month}>
                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b" 
                    style={{ borderBottomColor: secondaryColor }}>
                  {month}
                  <span className="ml-2 text-sm text-gray-500">
                    ({monthPhotos.length} photos)
                  </span>
                </h3>
                <PhotoViewer photos={monthPhotos} />
              </div>
            ))
          ) : (
            // Single group - don't show month header
            <PhotoViewer photos={filteredPhotos} />
          )}
        </div>
      )}
    </div>
  )
}