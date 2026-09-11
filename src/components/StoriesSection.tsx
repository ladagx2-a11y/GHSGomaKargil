'use client'

import { useRef, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export function StoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('news_stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (data && !error) {
        setStories(data)
      }
      setLoading(false)
    }

    fetchStories()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -400 : 400
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 bg-[#eaeaea] dark:bg-[#080b10] relative overflow-hidden transition-colors duration-300">
      {/* Background radial gradient mimicking the screenshot's subtle lighting */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-white dark:bg-[#8c6b32] rounded-full filter blur-[150px] opacity-60 dark:opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#00a8cc]">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="text-[#00a8cc] text-xs font-extrabold tracking-[0.2em] uppercase">GHSGK Highlights</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#2a3644] dark:text-white mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
            Campus Stories
          </h2>
          <p className="text-[#556372] dark:text-gray-400 text-lg">
            Get a sense of the learning community and culture at Goma Kargil.
          </p>
        </div>

        {/* Carousel Area */}
        <div className="relative">
          
          {/* Navigation Arrows (Left side floating) */}
          <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 flex-col gap-4 z-20">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border-2 border-[#2a3644] dark:border-white text-[#2a3644] dark:text-white flex items-center justify-center hover:bg-[#2a3644] dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border-2 border-[#2a3644] dark:border-white text-[#2a3644] dark:text-white flex items-center justify-center hover:bg-[#2a3644] dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors bg-white/50 dark:bg-black/50 backdrop-blur-sm"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 lg:ml-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="font-bold">Loading latest stories...</p>
                </div>
              </div>
            ) : stories.length === 0 ? (
              <div className="w-full flex items-center justify-center h-[300px] text-gray-500 font-bold">
                No stories published yet.
              </div>
            ) : (
              stories.map((story) => (
                <Link 
                  href={`/news/${story.id}`}
                  key={story.id} 
                  className="min-w-[320px] md:min-w-[380px] w-[320px] md:w-[380px] h-[460px] shrink-0 snap-start group cursor-pointer flex flex-col bg-white dark:bg-[#111720] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent dark:border-white/5"
                >
                  {/* Image Container */}
                  <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                    {story.image_url ? (
                      <img 
                        src={story.image_url} 
                        alt={story.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-black/50 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-[#00a8cc] shadow-sm">
                      Campus News
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3 className="text-[#2a3644] dark:text-white text-xl font-bold mb-3 leading-snug group-hover:text-[#00a8cc] dark:group-hover:text-[#cfa861] transition-colors line-clamp-2" style={{ fontFamily: 'var(--font-lora)' }}>
                      {story.title}
                    </h3>
                    <p className="text-[#556372] dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {story.summary}
                    </p>
                    
                    {/* Bottom Action Area */}
                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-[#00a8cc] dark:text-[#cfa861] font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                        Read Story
                        <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

        </div>

        {/* Footer Button */}
        <div className="mt-12 text-center">
          <Link 
            href="/news"
            className="inline-flex border-2 border-[#2a3644] dark:border-[#00a8cc] text-[#2a3644] dark:text-[#00a8cc] px-8 py-3 font-bold text-sm hover:bg-[#2a3644] hover:text-white dark:hover:bg-[#00a8cc] dark:hover:text-black transition-colors shadow-sm cursor-pointer"
          >
            More Campus Stories
          </Link>
        </div>

      </div>

      {/* Global style to hide scrollbar just in case inline styles fail */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
