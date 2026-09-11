'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data && !error && data.length > 0) {
        setSlides(data)
      } else {
        // Fallback default slide if database is empty or not configured
        setSlides([{
          id: 'fallback',
          image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
          label: 'Welcome to GHS Goma Kargil',
          title: 'Rooted in Resilience'
        }])
      }
      setLoading(false)
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [slides.length])

  if (loading) {
    return <section className="h-screen w-full bg-[#0b0f14]" /> // Blank loading state
  }

  const currentSlide = slides[currentIndex]

  return (
    <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0b0f14]">
      
      {/* Carousel Backgrounds */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={currentSlide.image_url}
            alt={currentSlide.title}
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Left Hero Content */}
      <div className="absolute bottom-16 left-6 md:bottom-24 md:left-16 z-20 w-full max-w-[80%] md:max-w-[60%] lg:max-w-[50%] pr-6 md:pr-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[3px] bg-[#cfa861] shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              <h3 className="text-[#cfa861] font-bold text-sm md:text-lg tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {currentSlide.title}
              </h3>
            </div>
            
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-8 max-w-3xl"
              style={{ fontFamily: 'var(--font-lora)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              {currentSlide.label}
            </h1>

            <div className="flex flex-col sm:flex-row gap-4">
              {currentSlide.button_text && currentSlide.button_link && (
                <a 
                  href={currentSlide.button_link} 
                  className="bg-[#cfa861] hover:bg-white text-black px-8 py-4 rounded-full font-bold text-sm md:text-base transition-colors text-center shadow-lg hover:shadow-xl"
                >
                  {currentSlide.button_text}
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Side Pagination / Progress */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex
          return (
            <div 
              key={slide.id} 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setCurrentIndex(idx)}
            >
              <span className={`text-xs md:text-sm font-bold font-mono transition-colors duration-300 ${isActive ? 'text-[#cfa861]' : 'text-gray-400 group-hover:text-gray-200'}`}>
                0{idx + 1}
              </span>
              <div className="relative w-[3px] h-12 md:h-16 bg-white/10 overflow-hidden rounded-full">
                {isActive && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
                    className="absolute top-0 left-0 w-full bg-[#cfa861]"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cfa861] rounded-full filter blur-[200px] opacity-[0.07] pointer-events-none z-10" />
    </section>
  )
}
