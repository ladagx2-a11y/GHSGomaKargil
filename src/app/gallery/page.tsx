'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, X, Loader2, ZoomIn } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type GalleryImage = {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  created_at: string
}

const CATEGORIES = ['All', 'Campus', 'Academics', 'Events', 'Sports', 'Other']

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      
      if (data && !error) {
        setImages(data)
      }
      setLoading(false)
    }

    fetchImages()
  }, [])

  // Disable scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedImage])

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#080b10] transition-colors duration-300">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 bg-[#004e89] dark:bg-[#080b0f] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00a8cc]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto relative z-10 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <ImageIcon size={16} className="text-[#00a8cc] dark:text-[#cfa861]" />
            <span className="text-white/80 dark:text-[#cfa861] text-sm font-bold tracking-[0.2em] uppercase">Campus Life</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight" style={{ fontFamily: 'var(--font-lora)' }}
          >
            Photo Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto font-medium"
          >
            Take a visual tour of our modern facilities, vibrant classrooms, and beautiful campus environment.
          </motion.p>
        </div>
      </section>

      {/* Main Content & Filters */}
      <div className="flex-grow py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category
                    ? 'bg-[#2a3644] text-white dark:bg-[#cfa861] dark:text-black shadow-lg scale-105'
                    : 'bg-white dark:bg-[#111720] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Masonry Grid Layout */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 text-gray-500">
              <Loader2 size={40} className="animate-spin mb-4 text-[#00a8cc] dark:text-[#cfa861]" />
              <p className="font-bold uppercase tracking-widest text-sm">Loading Gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-32 text-gray-500">
              <ImageIcon size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-lora)' }}>No photos found in this category.</p>
              <p className="text-sm mt-2 opacity-60">Check back soon for new uploads.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            >
              <AnimatePresence>
                {filteredImages.map((img) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={img.id}
                    className="break-inside-avoid"
                  >
                    <div 
                      onClick={() => setSelectedImage(img)}
                      className="group relative bg-gray-200 dark:bg-black rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Image gets its intrinsic aspect ratio naturally via img tag in CSS column layout */}
                      <img 
                        src={img.image_url} 
                        alt={img.title} 
                        className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="inline-block px-2 py-1 bg-[#cfa861] text-black text-[10px] font-bold uppercase tracking-widest rounded mb-2">
                            {img.category}
                          </span>
                          <h3 className="text-white font-bold text-lg leading-tight mb-1" style={{ fontFamily: 'var(--font-lora)' }}>
                            {img.title}
                          </h3>
                        </div>
                        <ZoomIn className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors drop-shadow-md" size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-7xl w-full max-h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              
              <div className="mt-6 text-center max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-lora)' }}>
                  {selectedImage.title}
                </h2>
                {selectedImage.description && (
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {selectedImage.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <span className="text-[#cfa861]">{selectedImage.category}</span>
                  <span>•</span>
                  <span>{new Date(selectedImage.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
