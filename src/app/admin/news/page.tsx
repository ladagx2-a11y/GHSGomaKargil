'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { NewsModal } from '@/components/admin/NewsModal'

export default function NewsManagement() {
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<any>(null)

  const fetchStories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('news_stories')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data && !error) setStories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchStories()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news story? This cannot be undone.')) return
    
    await supabase.from('news_stories').delete().eq('id', id)
    fetchStories()
  }

  const openAddModal = () => {
    setEditingStory(null)
    setIsModalOpen(true)
  }

  const openEditModal = (story: any) => {
    setEditingStory(story)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-lora)' }}>News & Stories</h1>
          <p className="text-gray-400 text-sm">Manage the public blog posts and campus news.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#6ebcb5] hover:bg-[#5daea7] text-[#0b0f14] px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#6ebcb5]/20"
        >
          <Plus size={20} /> Create New Story
        </button>
      </div>

      <div className="bg-[#111720] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a2230] border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 font-medium">Cover</th>
                <th className="p-4 font-medium">Story Title</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date Created</th>
                <th className="p-4 pr-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-[#6ebcb5] border-t-transparent rounded-full animate-spin" />
                      Loading stories...
                    </div>
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="bg-black/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-white mb-1">No stories found</p>
                    <p className="text-sm">Click "Create New Story" to publish your first post.</p>
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 pl-6">
                      {story.image_url ? (
                        <div className="w-16 h-12 rounded bg-[#1a2230] overflow-hidden border border-white/10">
                          <img src={story.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-[#1a2230] flex items-center justify-center border border-white/10 text-gray-600">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white mb-1 group-hover:text-[#6ebcb5] transition-colors">{story.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{story.summary}</p>
                    </td>
                    <td className="p-4">
                      {story.is_published ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1a4f36]/30 text-[#6ebcb5] border border-[#6ebcb5]/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6ebcb5]" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-400 font-medium">
                      {new Date(story.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end items-center gap-2">
                        {story.is_published && (
                          <a 
                            href={`/news/${story.id}`}
                            target="_blank"
                            title="View Public Page"
                            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button 
                          onClick={() => openEditModal(story)}
                          title="Edit Story"
                          className="p-2 text-gray-400 hover:text-[#cfa861] bg-white/5 hover:bg-[#cfa861]/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(story.id)}
                          title="Delete Story"
                          className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchStories}
        editingStory={editingStory}
      />
    </div>
  )
}
