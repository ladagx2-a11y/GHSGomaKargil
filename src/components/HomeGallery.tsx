'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function HomeGallery() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [dimensions, setDimensions] = useState<Record<string, 'landscape' | 'portrait' | 'square'>>({})

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)
      
      if (data && !error) setImages(data)
      setLoading(false)
    }

    fetchGallery()
  }, [])

  if (loading || images.length === 0) return null

  return (
    <section className="py-24 bg-white dark:bg-[#0b0f14] overflow-hidden border-t border-gray-100 dark:border-white/5">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#cfa861] text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Campus Life</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3644] dark:text-white" style={{ fontFamily: 'var(--font-lora)' }}>
              Photo Gallery
            </h2>
          </div>
          <Link 
            href="/gallery" 
            className="group flex items-center gap-2 text-[#00a8cc] font-bold text-sm uppercase tracking-widest hover:text-[#cfa861] transition-colors pb-2"
          >
            View Full Gallery
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Aspect-Ratio Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[150px] md:auto-rows-[200px] grid-flow-row-dense gap-3 md:gap-4">
          {images.map((img) => {
            const layout = dimensions[img.id] || 'square' // default before load
            
            // Assign grid spans based on actual image dimensions
            let spanClass = 'col-span-1 row-span-1'
            if (layout === 'landscape') spanClass = 'col-span-2 row-span-1'
            else if (layout === 'portrait') spanClass = 'col-span-1 row-span-2'
            else if (layout === 'square') spanClass = 'col-span-1 row-span-1'

            return (
              <div 
                key={img.id} 
                className={`relative group rounded-xl overflow-hidden shadow-md bg-[#080b0f] transition-all duration-500 ${spanClass}`}
              >
                {img.image_url ? (
                  <img 
                    src={img.image_url} 
                    alt={img.title || 'Gallery Image'} 
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-700 ease-out" 
                    loading="lazy"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget
                      const ratio = naturalWidth / naturalHeight
                      let type: 'landscape' | 'portrait' | 'square' = 'square'
                      if (ratio > 1.2) type = 'landscape'
                      else if (ratio < 0.8) type = 'portrait'
                      
                      setDimensions(prev => ({ ...prev, [img.id]: type }))
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-white/10" />
                  </div>
                )}
                
                {/* Gradient Overlay (Darkens on hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="text-[#cfa861] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-md block mb-1">
                    {img.category || 'Featured'}
                  </span>
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg" style={{ fontFamily: 'var(--font-lora)' }}>
                    {img.title}
                  </h3>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
