"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  alt: string
  badge?: string | null
}

export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleImageChange = (index: number) => {
    if (index === activeIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-[2rem] bg-secondary/20 border border-border/40 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] group">
        {badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 tracking-wide">
              {badge}
            </span>
          </div>
        )}

        <div className="relative aspect-square">
          {/* Current image */}
          <Image
            src={images[activeIndex]}
            alt={alt}
            fill
            className={cn(
              "object-cover transition-all duration-500 ease-out",
              isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100",
              "group-hover:scale-110"
            )}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Zenith light reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none" />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleImageChange(idx)}
              className={cn(
                "relative w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer",
                "border-2",
                idx === activeIndex
                  ? "border-primary shadow-[0_0_0_3px_rgba(var(--primary),0.08)]"
                  : "border-transparent hover:border-border/60 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${alt} - imagen ${idx + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
              {/* Selection dot indicator */}
              {idx === activeIndex && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
