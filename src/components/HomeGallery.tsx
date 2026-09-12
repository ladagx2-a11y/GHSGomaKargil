'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function HomeGallery() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(4)
      
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

        {/* Masonry Layout - Dynamic to image size */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg bg-[#080b0f]"
            >
              {img.image_url ? (
                <img 
                  src={img.image_url} 
                  alt={img.title || 'Gallery Image'} 
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out" 
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center">
                  <ImageIcon size={48} className="text-white/10" />
                </div>
              )}
              
              {/* Gradient Overlay (Darkens on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="text-[#cfa861] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] drop-shadow-md">
                  {img.category || 'Featured'}
                </span>
                <h3 className="text-white font-bold text-lg md:text-xl leading-tight mt-1 drop-shadow-lg" style={{ fontFamily: 'var(--font-lora)' }}>
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
