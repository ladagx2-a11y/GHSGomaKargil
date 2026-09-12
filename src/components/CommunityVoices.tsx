'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Quote, UserCircle, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function CommunityVoices() {
  const [voices, setVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
                      className={`relative py-4 px-6 pr-0 cursor-pointer transition-all duration-300 group flex items-center justify-between ${
                        isActive ? 'ml-2' : 'hover:ml-2'
                      }`}
                    >
                      <div className="relative z-10 pr-4">
                        <h3 className={`text-xl md:text-2xl font-bold mb-1 transition-colors ${
                          isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                        }`} style={{ fontFamily: 'var(--font-lora)' }}>
                          {voice.name}
                        </h3>
                        <p className={`text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors ${
                          isActive ? 'text-[#cfa861]' : 'text-white/40 group-hover:text-white/70'
                        }`}>
                          {voice.role}
                        </p>
                      </div>

                      {/* Active Indicator (Triangle + Line) */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute left-[-12px] top-0 bottom-0 right-0 flex items-center pointer-events-none"
                        >
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-[#cfa861] border-b-[6px] border-b-transparent shrink-0 mt-[-24px]" />
                          <div className="flex-1 h-[2px] bg-[#cfa861] ml-auto mr-0 self-center" style={{ width: 'calc(100% - 250px)', minWidth: '40px' }} />
                        </motion.div>
                      )}
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f] via-black/50 to-transparent z-10" />
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
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 lg:p-12">
              <div className="max-w-lg mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`quote-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="text-[#cfa861] mb-2 flex items-start gap-3">
                      <Quote size={32} fill="currentColor" className="shrink-0 mt-1" />
                      <p className="text-white text-sm md:text-base font-medium leading-relaxed drop-shadow-md text-justify" style={{ fontFamily: 'var(--font-lora)' }}>
                        {currentVoice.quote.length > 250 
                          ? `${currentVoice.quote.substring(0, 250)}...` 
                          : currentVoice.quote}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <div className="flex justify-end mt-2 md:mt-0">
                <AnimatePresence mode="wait">
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    key={`btn-${activeIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="group flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-gray-300 font-bold text-xs tracking-wide drop-shadow-md">
                      Read <span className="font-extrabold text-white">{currentVoice.name.split(' ')[0]}'s</span> Story
                    </span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shadow-lg shrink-0">
                      <Plus size={20} />
                    </div>
                  </motion.button>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center md:p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl bg-white dark:bg-[#111720] md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                {currentVoice.image_url ? (
                  <img src={currentVoice.image_url} alt={currentVoice.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <UserCircle size={80} className="text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-full">
                <Quote size={40} className="text-[#cfa861] mb-6 opacity-30" />
                <h3 className="text-3xl font-extrabold text-[#2a3644] dark:text-white mb-2" style={{ fontFamily: 'var(--font-lora)' }}>{currentVoice.name}</h3>
                <p className="text-[#00a8cc] font-bold text-sm tracking-widest uppercase mb-8">{currentVoice.role}</p>
                
                <div className="prose dark:prose-invert prose-lg">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                    {currentVoice.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
