'use client'

import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative aspect-[4/3] bg-gray-100">
          <div className="image-placeholder w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">Nessuna immagine disponibile</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative aspect-[4/3] bg-gray-100">
        <div className="image-placeholder w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">
              Immagine {currentImage + 1} di {images.length}
            </div>
            <div className="text-xs mt-1">{title}</div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
              disabled={currentImage === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-70 transition-opacity"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentImage(Math.min(images.length - 1, currentImage + 1))}
              disabled={currentImage === images.length - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-70 transition-opacity"
            >
              →
            </button>
          </>
        )}

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImage ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {images.slice(0, 8).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-colors ${
                  index === currentImage
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="image-placeholder w-full h-full rounded"></div>
              </button>
            ))}
            {images.length > 8 && (
              <div className="flex-shrink-0 w-20 h-20 bg-gray-800 rounded flex items-center justify-center text-white text-sm font-medium">
                +{images.length - 8}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
