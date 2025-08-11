// src/components/photo-lightbox.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Download, Calendar, Loader2, FileText, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  originalName: string
  caption?: string | null
  uploadedAt: Date
}

interface PhotoLightboxProps {
  photos: Photo[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function PhotoLightbox({ photos, initialIndex, isOpen, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isDownloading, setIsDownloading] = useState(false)

  // Update current index when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [initialIndex, isOpen])

  // Stable close function to prevent navigation issues
  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onClose()
  }, [onClose])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior to avoid page navigation
      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          handleClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          e.preventDefault()
          goToNext()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Prevent body scroll when modal is open - safer implementation
  useEffect(() => {
    if (!isOpen) return

    // Store original values
    const originalBodyOverflow = document.body.style.overflow
    const originalBodyHeight = document.body.style.height
    const originalHtmlOverflow = document.documentElement.style.overflow

    // Apply scroll prevention
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    document.documentElement.style.overflow = 'hidden'

    // Cleanup function
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.body.style.height = originalBodyHeight
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [isOpen])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  // Enhanced download function that works with CORS and Cloudinary
  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isDownloading) return // Prevent multiple downloads
    
    setIsDownloading(true)
    
    try {
      const photo = photos[currentIndex]
      console.log('🔄 Starting download for:', photo.originalName)
      
      // Fetch the image as a blob to handle CORS properly
      const response = await fetch(photo.url, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      }
      
      // Convert response to blob
      const blob = await response.blob()
      console.log('✅ Image fetched as blob, size:', blob.size, 'bytes')
      
      // Create object URL for the blob
      const blobUrl = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = photo.originalName || `photo-${Date.now()}.jpg`
      link.style.display = 'none'
      
      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 1000)
      
      console.log('✅ Download initiated for:', photo.originalName)
      
    } catch (error) {
      console.error('❌ Download failed:', error)
      
      // Fallback: try simple link download
      try {
        console.log('🔄 Trying fallback download method...')
        const photo = photos[currentIndex]
        const link = document.createElement('a')
        link.href = photo.url
        link.download = photo.originalName || `photo-${Date.now()}.jpg`
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log('✅ Fallback download initiated')
      } catch (fallbackError) {
        console.error('❌ Fallback download also failed:', fallbackError)
        alert('Download failed. You can right-click the image and select "Save image as..." to download manually.')
      }
    } finally {
      setIsDownloading(false)
    }
  }, [photos, currentIndex, isDownloading])

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose(e)
    }
  }, [handleClose])

  // Don't render if not open or no photos
  if (!isOpen || photos.length === 0) return null

  // Safety check for current photo
  const currentPhoto = photos[currentIndex]
  if (!currentPhoto) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm" 
      style={{ height: '100vh', width: '100vw' }}
      onClick={handleBackgroundClick}
    >
      {/* Professional Header with Glass Effect */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="text-sm font-light text-white/60 mb-1">
              {currentIndex + 1} of {photos.length}
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-white/80" />
              <span className="text-lg font-light">{currentPhoto.originalName}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(currentPhoto.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              size="sm"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
            <Button 
              onClick={handleClose}
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              size="icon"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex items-center justify-center h-full pt-24 pb-32">
        <div className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center justify-center">
          {/* Modern Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-md rounded-full w-14 h-14 p-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToPrevious()
                }}
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-md rounded-full w-14 h-14 p-0"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  goToNext()
                }}
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </>
          )}

          {/* Responsive Image Container */}
          <div 
            className="relative bg-white/5 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 w-full max-w-6xl overflow-hidden"
            style={{
              maxHeight: currentPhoto.caption ? 'calc(100vh - 300px)' : 'calc(100vh - 200px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section - Responsive Height */}
            <div 
              className="relative w-full flex items-center justify-center bg-black/20"
              style={{
                height: currentPhoto.caption ? 'calc(100vh - 400px)' : 'calc(100vh - 250px)',
                minHeight: '300px',
                maxHeight: currentPhoto.caption ? '60vh' : '70vh'
              }}
            >
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.originalName}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                onError={() => {
                  console.error('Image failed to load:', currentPhoto.url)
                }}
              />
            </div>
            
            {/* Description Section - Always Visible */}
            {currentPhoto.caption && (
              <div className="relative">
                {/* Clean separation line */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                {/* Description content with proper scrolling */}
                <div className="bg-gradient-to-t from-black/95 via-black/90 to-black/80">
                  <div className="p-6 lg:p-8 max-w-5xl mx-auto">
                    {/* Clean header with icon */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-white/80" />
                        <h3 className="text-lg font-light text-white">Description</h3>
                      </div>
                    </div>
                    
                    {/* Scrollable description text */}
                    <div 
                      className="overflow-y-auto custom-scrollbar"
                      style={{ 
                        maxHeight: '200px'
                      }}
                    >
                      <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pr-4">
                        {currentPhoto.caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Thumbnail Navigation */}
      {photos.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-center px-4">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/10">
              <div className="max-w-screen-xl overflow-hidden">
                <div 
                  className="flex space-x-3 lg:space-x-5 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${Math.max(0, (currentIndex - 2) * (typeof window !== 'undefined' && window.innerWidth > 1024 ? 100 : 84))}px)`,
                    width: `${photos.length * (typeof window !== 'undefined' && window.innerWidth > 1024 ? 100 : 84)}px`,
                    padding: '6px'
                  }}
                >
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setCurrentIndex(index)
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all transform ${
                        index === currentIndex 
                          ? 'border-white shadow-lg scale-110' 
                          : 'border-white/40 hover:border-white/80 hover:scale-105'
                      }`}
                      style={{ 
                        minWidth: typeof window !== 'undefined' && window.innerWidth > 1024 ? '80px' : '64px', 
                        minHeight: typeof window !== 'undefined' && window.innerWidth > 1024 ? '80px' : '64px',
                        boxShadow: index === currentIndex 
                          ? '0 0 0 0.5px #ffffff, 0 0 4px rgba(255, 255, 255, 0.4)' 
                          : undefined
                      }}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.originalName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {/* Clean selection indicator */}
                      {index === currentIndex && (
                        <>
                          <div className="absolute top-1 right-1 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-white rounded-full shadow-lg" />
                          <div className="absolute inset-0 bg-white/8" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}