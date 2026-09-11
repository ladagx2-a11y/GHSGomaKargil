'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

type Story = {
  id: string
  title: string
  summary: string
  image_url: string
  author: string
  published_at?: string
  created_at?: string
}

export default function NewsPage() {
  const [stories, setStories] = useState<Story[]>([])
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0b0f14] transition-colors">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 bg-[#004e89] dark:bg-[#080b0f] text-center relative overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00a8cc]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto relative z-10 pt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen size={16} className="text-[#00a8cc] dark:text-[#cfa861]" />
            <span className="text-white/80 dark:text-[#cfa861] text-sm font-bold tracking-[0.2em] uppercase">Archive</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight" style={{ fontFamily: 'var(--font-lora)' }}>
            Campus Stories
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Explore the latest news, announcements, and inspiring stories from Government High School Goma Kargil.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 px-6 flex-grow">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-4 border-[#00a8cc] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No stories published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/news/${story.id}`}
                    className="group bg-white dark:bg-[#131920] rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col h-[450px]"
                  >
                    {/* Image Container */}
                    <div className="relative h-[220px] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {story.image_url ? (
                        <Image
                          src={story.image_url}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
                          <BookOpen size={40} />
                        </div>
                      )}
                      
                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-[#0b0f14]/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Calendar size={12} className="text-[#004e89] dark:text-[#cfa861]" />
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                          {new Date(story.created_at || story.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
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
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                          <User size={14} className="text-[#00a8cc] dark:text-[#cfa861]" />
                          <span>{story.author || 'Administration'}</span>
                        </div>
                        <span className="text-[#00a8cc] dark:text-[#cfa861] font-bold text-xs tracking-widest uppercase flex items-center gap-2">
                          Read 
                          <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
