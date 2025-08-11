'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, X, FileImage, CloudUpload, Upload, ZoomIn, Check, Loader2 } from 'lucide-react'
import { savePhotoToProject, updatePhotoCaption, deletePhoto } from '@/lib/actions/photos'
import Image from 'next/image'
import { PhotoLightbox } from '@/components/photo-lightbox'

interface PhotoUploadProps {
  projectId: string
  reportId?: string
  existingPhotos?: Array<{
    id: string
    url: string
    originalName: string
    caption?: string
  }>
}

interface UploadedPhoto {
  id?: string
  url: string
  name: string
  caption: string
}

export function PhotoUpload({ projectId, reportId, existingPhotos = [] }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    existingPhotos.map(photo => ({
      id: photo.id,
      url: photo.url,
      name: photo.originalName,
      caption: photo.caption || ''
    }))
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingFileCount, setUploadingFileCount] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [savingCaptions, setSavingCaptions] = useState<Set<string>>(new Set())
  const [savedPhotos, setSavedPhotos] = useState<Set<string>>(new Set())
  const [deletingPhotos, setDeletingPhotos] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    setUploadingFileCount(files.length)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        try {
          const formData = new FormData()
          formData.append('file', file)
          
          // Upload to Cloudinary via our API route
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${errorText}`)
          }
          
          const result = await response.json()
          
          if (!result.success || !result.url) {
            throw new Error(`Upload failed: ${result.error || 'No URL returned'}`)
          }
          
          // Save to database
          const dbResult = await savePhotoToProject(
            projectId,
            result.url,
            result.name,
            result.size,
            file.type,
            '',
            reportId
          )

          if (dbResult.success) {
            setPhotos(prev => [...prev, {
              id: dbResult.photo.id,
              url: result.url,
              name: result.name,
              caption: ''
            }])
          } else {
            throw new Error(`Failed to save photo to database`)
          }
          
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError)
          alert(`Error uploading ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`)
        }
      }
      
      // Clear file input after upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Upload process failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      setUploadingFileCount(0)
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFilesSelected(files)
  }

  const handleFilesSelected = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== files.length) {
      alert('Only image files are supported')
    }
    
    // Check file sizes (10MB limit)
    const validFiles = imageFiles.filter(file => file.size <= 10 * 1024 * 1024)
    
    if (validFiles.length !== imageFiles.length) {
      alert('Some files exceed the 10MB limit')
    }
    
    // Automatically upload valid files
    if (validFiles.length > 0) {
      await uploadFiles(validFiles)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      await handleFilesSelected(files)
    }
  }

  const updateCaption = (index: number, caption: string) => {
    setPhotos(prev => prev.map((photo, i) => 
      i === index ? { ...photo, caption } : photo
    ))
  }

  const saveCaptionToDatabase = async (index: number) => {
    const photo = photos[index]
    if (!photo.id) return // Skip if photo doesn't have an ID yet
    
    setSavingCaptions(prev => new Set(prev).add(photo.id!))
    
    try {
      // Use your existing updatePhotoCaption function (only needs photoId and caption)
      const result = await updatePhotoCaption(photo.id, photo.caption)
      if (!result.success) {
        throw new Error('Failed to save caption')
      }
      
      // Add to saved set
      setSavedPhotos(prev => new Set(prev).add(photo.id!))
      
      // Remove "saved" indicator after 2 seconds
      setTimeout(() => {
        setSavedPhotos(prev => {
          const newSet = new Set(prev)
          newSet.delete(photo.id!)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error('Error saving caption:', error)
      alert('Failed to save caption. Please try again.')
    } finally {
      setSavingCaptions(prev => {
        const newSet = new Set(prev)
        newSet.delete(photo.id!)
        return newSet
      })
    }
  }

  const removePhoto = async (index: number) => {
    const photo = photos[index]
    
    // If photo has an ID, it exists in the database and needs to be deleted
    if (photo.id) {
      setDeletingPhotos(prev => new Set(prev).add(photo.id!))
      
      try {
        const result = await deletePhoto(photo.id)
        if (!result.success) {
          throw new Error('Failed to delete photo')
        }
        
        // Only remove from UI after successful database deletion
        setPhotos(prev => prev.filter((_, i) => i !== index))
      } catch (error) {
        console.error('Error deleting photo:', error)
        alert('Failed to delete photo. Please try again.')
      } finally {
        setDeletingPhotos(prev => {
          const newSet = new Set(prev)
          newSet.delete(photo.id!)
          return newSet
        })
      }
    } else {
      // Photo not in database yet, just remove from UI
      setPhotos(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Convert photos to lightbox format
  const lightboxPhotos = photos.map(photo => ({
    id: photo.id || '',
    url: photo.url,
    originalName: photo.name,
    caption: photo.caption,
    uploadedAt: new Date() // We don't have the real upload date here, so use current date
  }))

  return (
    <>
      <Card className="bg-white border-0 shadow-lg shadow-gray-100/50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-light tracking-wide text-gray-900">
                Project Photos
              </CardTitle>
              <CardDescription className="mt-1">
                Upload construction photos and add descriptions. Photos are automatically optimized and stored securely.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 py-6 space-y-6">
          {/* Upload Area */}
          {!isUploading && (
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Construction Photos
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Drag and drop files here, or click to browse
                </p>
                <Button 
                  type="button"
                  onClick={handleFileSelect}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-3"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Photos to Upload
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Supports: JPG, PNG, HEIC • Max 10MB per file • Photos upload automatically
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="text-center py-8">
              <CloudUpload className="mx-auto h-12 w-12 text-blue-500 animate-bounce mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">Uploading Photos...</h3>
              <p className="text-sm text-blue-600">
                Processing {uploadingFileCount} photo{uploadingFileCount > 1 ? 's' : ''} with automatic optimization
              </p>
            </div>
          )}

          {/* Uploaded Photos - Editable with Lightbox */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Uploaded Photos ({photos.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <FileImage className="w-4 h-4 mr-1" />
                    Stored Securely
                  </div>
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <ZoomIn className="w-4 h-4 mr-1" />
                    Click to expand
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {photos.map((photo, index) => (
                  <div key={photo.id || index} className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:border-blue-300">
                    <div 
                      className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative group cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Hover Overlay for Lightbox */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <ZoomIn className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent lightbox from opening
                          removePhoto(index)
                        }}
                        disabled={photo.id ? deletingPhotos.has(photo.id) : false}
                      >
                        {photo.id && deletingPhotos.has(photo.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border">
                        <FileImage className="w-4 h-4 mr-2 flex-shrink-0 text-blue-500" />
                        <span className="truncate font-medium">{photo.name}</span>
                      </div>
                      <div>
                        <Label htmlFor={`caption-${index}`} className="text-sm font-semibold text-gray-700 mb-2 block">
                          Photo Description
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id={`caption-${index}`}
                            value={photo.caption}
                            onChange={(e) => updateCaption(index, e.target.value)}
                            placeholder="Describe what's shown in this photo..."
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveCaptionToDatabase(index)
                              }
                            }}
                          />
                          {photo.id && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => saveCaptionToDatabase(index)}
                              disabled={savingCaptions.has(photo.id)}
                              className={savedPhotos.has(photo.id) ? 'bg-green-600 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700 text-white px-3'}
                            >
                              {savingCaptions.has(photo.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : savedPhotos.has(photo.id) ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span className="ml-1">Saved!</span>
                                </>
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Press Enter or click ✓ to save description
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  )
}