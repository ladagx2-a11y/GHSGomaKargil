'use client'

import { useEffect, useState } from 'react'
import { FileText, Newspaper, Image as ImageIcon, UserCircle, Clock, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type ActivityItem = {
  id: string
  title: string
  type: 'News' | 'Record' | 'Photo' | 'Voice'
  date: string
  url: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    news: 0,
    records: 0,
    gallery: 0,
    voices: 0,
  })
  
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      
      // Fetch exact counts
      const [
        { count: newsCount }, 
        { count: recordsCount }, 
        { count: galleryCount }, 
        { count: voicesCount }
      ] = await Promise.all([
        supabase.from('news_stories').select('*', { count: 'exact', head: true }),
        supabase.from('compliance_documents').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('community_voices').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        news: newsCount || 0,
        records: recordsCount || 0,
        gallery: galleryCount || 0,
        voices: voicesCount || 0,
      })

      // Fetch recent items for activity feed
      const [
        { data: newsData },
        { data: recordsData },
        { data: galleryData },
      ] = await Promise.all([
        supabase.from('news_stories').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('compliance_documents').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('gallery_images').select('id, title, created_at').order('created_at', { ascending: false }).limit(3),
      ])

      const activity: ActivityItem[] = [
        ...(newsData || []).map(d => ({ id: d.id, title: d.title, type: 'News' as const, date: d.created_at, url: '/admin/news' })),
        ...(recordsData || []).map(d => ({ id: d.id, title: d.title, type: 'Record' as const, date: d.created_at, url: '/admin/records' })),
        ...(galleryData || []).map(d => ({ id: d.id, title: d.title, type: 'Photo' as const, date: d.created_at, url: '/admin/gallery' })),
      ]

      // Sort by date descending and take top 5
      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecentActivity(activity.slice(0, 5))
      
      setLoading(false)
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-lora)' }}>Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back. Here's what's happening at GHS Goma Kargil today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-[#111720] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Newspaper size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-semibold mb-1">News Stories</h3>
          <p className="text-3xl font-bold text-white">{loading ? '-' : stats.news}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#111720] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ImageIcon size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-semibold mb-1">Gallery Photos</h3>
          <p className="text-3xl font-bold text-white">{loading ? '-' : stats.gallery}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#111720] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-semibold mb-1">Public Records</h3>
          <p className="text-3xl font-bold text-white">{loading ? '-' : stats.records}</p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-[#111720] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <UserCircle size={24} />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-semibold mb-1">Community Voices</h3>
          <p className="text-3xl font-bold text-white">{loading ? '-' : stats.voices}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111720] border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-lora)' }}>
            <Clock size={18} className="text-[#8c6b32]" />
            Recent Activity
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading activity...</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No recent activity found. Start adding content!
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <Link key={`${activity.type}-${activity.id}-${i}`} href={activity.url} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                      {activity.type === 'News' && <Newspaper size={18} />}
                      {activity.type === 'Photo' && <ImageIcon size={18} />}
                      {activity.type === 'Record' && <FileText size={18} />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{activity.title}</p>
                      <p className="text-gray-500 text-xs">New {activity.type} Published</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-xs">{new Date(activity.date).toLocaleDateString()}</span>
                    <ExternalLink size={14} className="text-gray-600 group-hover:text-[#cfa861] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-[#111720] border border-white/5 rounded-2xl p-6 h-fit">
          <h3 className="text-white font-bold mb-6" style={{ fontFamily: 'var(--font-lora)' }}>Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/news" className="block w-full text-center bg-[#8c6b32]/20 hover:bg-[#8c6b32]/30 text-[#e8cc94] py-3 rounded-xl transition-colors text-sm font-semibold">
              Write News Story
            </Link>
            <Link href="/admin/gallery" className="block w-full text-center bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors text-sm font-semibold">
              Upload Photo
            </Link>
            <Link href="/admin/records" className="block w-full text-center bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-colors text-sm font-semibold">
              Add Public Record
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
