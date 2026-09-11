'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Bell, Calendar, FileText, Megaphone, ChevronRight, Tag } from 'lucide-react'

type Notice = {
  id: string
  created_at: string
  title: string
  category: string
  content: string | null
  attachment_url: string | null
  is_active: boolean
}

const DEMO_NOTICES: Notice[] = [
  {
    id: 'n1',
    created_at: '2026-09-01T10:00:00Z',
    title: 'Annual Day Celebration – September 15th',
    category: 'Event',
    content: 'All students and parents are invited to attend the Annual Day Celebration at the school auditorium. Cultural programs, prize distribution, and guest lectures are scheduled.',
    attachment_url: null,
    is_active: true,
  },
  {
    id: 'n2',
    created_at: '2026-08-25T08:00:00Z',
    title: 'Tender Notice: Supply of Laboratory Equipment',
    category: 'Tender',
    content: 'Sealed tenders are invited from registered firms for the supply and installation of laboratory equipment for the science wing. Last date for submission: September 10, 2026.',
    attachment_url: '#',
    is_active: true,
  },
  {
    id: 'n3',
    created_at: '2026-08-20T09:30:00Z',
    title: 'Mid-Term Examination Schedule Released',
    category: 'General',
    content: 'The mid-term examination schedule for all classes has been published. Students are advised to collect their admit cards from the front office.',
    attachment_url: null,
    is_active: true,
  },
  {
    id: 'n4',
    created_at: '2026-08-15T06:00:00Z',
    title: 'Independence Day Flag Hoisting Ceremony',
    category: 'Event',
    content: 'Flag hoisting ceremony will be held on August 15th at 8:00 AM. All staff and students are requested to attend in proper uniform.',
    attachment_url: null,
    is_active: true,
  },
]

const categoryIcons: Record<string, typeof Bell> = {
  'Event': Calendar,
  'Tender': FileText,
  'General': Megaphone,
}

const categoryColors: Record<string, string> = {
  'Event': 'text-[#6ebcb5] bg-[#6ebcb5]/10 border-[#6ebcb5]/20',
  'Tender': 'text-[#cfa861] bg-[#cfa861]/10 border-[#cfa861]/20',
  'General': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
}

export function Announcements() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    setLoading(true)
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4)

    if (!error && data && data.length > 0) {
      setNotices(data)
    } else {
      setNotices(DEMO_NOTICES)
    }
    setLoading(false)
  }

  return (
    <section id="announcements" className="py-28 px-6 bg-[#0d1117] relative">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#cfa861] rounded-full filter blur-[250px] opacity-[0.07]" />
      
      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#cfa861] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">Latest Updates</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Announcements & Notices
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Stay informed with the latest circulars, tenders, events, and official notifications from the institution.
            </p>
          </motion.div>
        </div>

        {/* Notices Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#8c6b32] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div 
            className="max-w-4xl mx-auto space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {notices.map((notice, i) => {
              const Icon = categoryIcons[notice.category] || Bell
              const colors = categoryColors[notice.category] || categoryColors['General']
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group flex gap-5 p-6 rounded-2xl bg-[#131920] border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#1a2230] transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${colors}`}>
                    <Icon size={20} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#cfa861] transition-colors leading-snug">
                        {notice.title}
                      </h3>
                      <span className="shrink-0 text-xs text-gray-500 font-medium mt-1">
                        {new Date(notice.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${colors}`}>
                        <Tag size={10} />
                        {notice.category}
                      </span>
                      {notice.attachment_url && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText size={12} /> Attachment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={20} className="shrink-0 text-gray-600 group-hover:text-[#6ebcb5] transition-colors self-center" />
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
