'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Quote, UserCircle, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function CommunityVoices() {
  const [voices, setVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetchVoices = async () => {
      const { data, error } = await supabase
        .from('community_voices')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (data && !error && data.length > 0) {
        setVoices(data)
      }
      setLoading(false)
    }

    fetchVoices()
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 bg-[#004e89] overflow-hidden min-h-[700px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </section>
    )
  }

  if (voices.length === 0) {
    return null // Hide section entirely if no active voices
  }

  // Safely ensure activeIndex is within bounds
  const currentVoice = voices[activeIndex] || voices[0]

  return (
    <section className="relative py-24 bg-[#004e89] overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-white/5 -skew-y-3 origin-bottom-left" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-[#00a8cc]/20 -skew-y-2 origin-bottom-left" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row min-h-[700px]">
          
          {/* LEFT COLUMN: Names & Roles */}
          <div className="w-full md:w-[45%] lg:w-[40%] py-12 md:pr-12 flex flex-col justify-center">
            
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#00a8cc]" />
                <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">Our Community</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white" style={{ fontFamily: 'var(--font-lora)' }}>
                GHSGK Voices
              </h2>
            </div>

            {/* Scrollable Container (Shows ~5 items, hides scrollbar) */}
            <div className="flex flex-col gap-2 relative max-h-[420px] overflow-y-auto pb-8 pr-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { display: none; }
              `}} />
              <div className="custom-scrollbar">
                {voices.map((voice, index) => {
                  const isActive = index === activeIndex
                  return (
                    <div 
                      key={voice.id}
                      onClick={() => setActiveIndex(index)}
                      className={`relative py-5 px-6 cursor-pointer transition-all duration-300 group ${
                        isActive ? 'ml-6' : 'hover:ml-2'
                      }`}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 w-3 h-3 bg-[#00a8cc] rotate-45"
                        />
                      )}

                      <div className="relative z-10">
                        <h3 className={`text-2xl font-bold mb-1 transition-colors ${
                          isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                        }`} style={{ fontFamily: 'var(--font-lora)' }}>
                          {voice.name}
                        </h3>
                        <p className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                          isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                        }`}>
                          {voice.role}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Scroll indicator hint if more than 5 */}
            {voices.length > 5 && (
              <div className="mt-4 text-white/30 text-xs font-bold uppercase tracking-widest animate-pulse flex justify-center">
                ↓ Scroll for more voices ↓
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Image & Quote */}
          <div className="w-full md:w-[55%] lg:w-[60%] relative min-h-[500px] md:min-h-full rounded-2xl overflow-hidden shadow-2xl">
            {/* Top green accent bar */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#2a9d8f] z-20" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 z-0 bg-[#080b0f] flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-black/40 z-10" />
                {currentVoice.image_url ? (
                  <img 
                    src={currentVoice.image_url} 
                    alt={currentVoice.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle size={120} className="text-white/10" />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Quote Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 lg:p-16">
              <div className="max-w-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`quote-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="text-[#00a8cc] mb-4">
                      <Quote size={48} fill="currentColor" />
                    </div>
                    <p className="text-white text-lg md:text-xl font-medium leading-relaxed drop-shadow-lg" style={{ fontFamily: 'var(--font-lora)' }}>
                      "{currentVoice.quote}"
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex justify-end">
                <AnimatePresence mode="wait">
                  <motion.a
                    href={currentVoice.details_link || '#'}
                    key={`btn-${activeIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="group flex items-center gap-4 cursor-pointer"
                  >
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">
                      Read <span className="font-extrabold">{currentVoice.name.split(' ')[0]}'s</span> Story
                    </span>
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#004e89] transition-colors shadow-lg shrink-0">
                      <Plus size={24} />
                    </div>
                  </motion.a>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
