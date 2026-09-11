'use client'

import { useEffect, useState, use } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function NewsArticle({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const [story, setStory] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('news_stories')
        .select('*')
        .eq('id', unwrappedParams.id)
        .single()
      
      if (error || !data || !data.is_published) {
        notFound()
      } else {
        setStory(data)
      }
      setLoading(false)
    }

    fetchStory()
  }, [unwrappedParams.id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-32 pb-24 bg-white dark:bg-[#0b0f14]">
          <div className="w-12 h-12 border-4 border-[#6ebcb5] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!story) return null // handled by notFound()

  // Split plain text by double newlines or single newlines to create paragraphs
  const paragraphs = story.content.split(/\n\s*\n/).filter((p: string) => p.trim() !== '')

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0b0f14]">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-24">
        {/* Hero Section */}
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-[#1a2230]">
          {story.image_url ? (
            <img 
              src={story.image_url} 
              alt={story.title} 
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a2230] to-[#111720]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent" />
          
          <div className="absolute bottom-0 w-full px-6 pb-12 md:pb-24">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/#stories" 
                className="inline-flex items-center gap-2 text-[#cfa861] font-bold text-sm uppercase tracking-wider mb-6 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> Back to News
              </Link>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
                {story.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-300 font-medium text-sm">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#6ebcb5]" />
                  {new Date(story.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-[#6ebcb5]" />
                  {Math.ceil(story.content.split(' ').length / 200)} min read
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-6 pt-16">
          <div className="bg-gray-50 dark:bg-[#111720] border-l-4 border-[#cfa861] p-6 md:p-8 rounded-r-2xl mb-12 shadow-sm">
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light italic leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
              {story.summary}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-loose prose-p:text-gray-700 dark:prose-p:text-gray-300">
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="mb-6 text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
