'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PhotoLightbox } from '@/components/photo-lightbox'

interface Photo {
  id: string
  url: string
  originalName: string
  caption?: string | null
  uploadedAt: Date
}

interface PhotoViewerProps {
  photos: Photo[]
}

export function PhotoViewer({ photos }: PhotoViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  return (
    <>
      {/* Photo Grid - Read Only with Click to Expand */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="space-y-2">
            {/* Clickable Photo Container */}
            <div 
              className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={photo.url}
                alt={photo.originalName}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            {/* Photo Caption Display */}
            {photo.caption && (
              <div className="px-1">
                <p className="text-sm text-gray-600 line-clamp-2">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photos={photos}
        initialIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  )
}