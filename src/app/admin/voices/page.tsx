'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, UserCircle, MoveVertical, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VoiceModal } from '@/components/admin/VoiceModal'
import Image from 'next/image'

export default function VoicesManagement() {
  const [voices, setVoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVoice, setEditingVoice] = useState<any>(null)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const fetchVoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('community_voices')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (data && !error) setVoices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voice?')) return
    
    await supabase.from('community_voices').delete().eq('id', id)
    fetchVoices()
  }

  const openAddModal = () => {
    setEditingVoice(null)
    setIsModalOpen(true)
  }

  const openEditModal = (voice: any) => {
    setEditingVoice(voice)
    setIsModalOpen(true)
  }

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return

    // Reorder the array locally
    const newVoices = [...voices]
    const draggedItem = newVoices[draggedItemIndex]
    newVoices.splice(draggedItemIndex, 1)
    newVoices.splice(index, 0, draggedItem)
    
    setDraggedItemIndex(index)
    setVoices(newVoices)
  }

  const handleDragEnd = async () => {
    setDraggedItemIndex(null)
    
    // Save new sort order to Supabase
    const updates = voices.map((voice, index) => ({
      id: voice.id,
      name: voice.name,
      role: voice.role,
      quote: voice.quote,
      image_url: voice.image_url,
      is_active: voice.is_active,
      details_link: voice.details_link,
      sort_order: index, // New order
    }))

    await supabase.from('community_voices').upsert(updates)
  }

  const filteredVoices = voices.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-lora)' }}>Community Voices</h1>
          <p className="text-gray-400 text-sm">Manage the dynamic voices shown on the landing page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Plus size={16} />
          Add Voice
        </button>
      </div>

      <div className="bg-[#111720] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080b0f] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8c6b32]/50"
            />
          </div>
          <div className="text-xs text-gray-500">
            Showing {filteredVoices.length} voices
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-4 w-12"></th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Name & Role</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quote Preview</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-[#8c6b32] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredVoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <UserCircle size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No community voices found.</p>
                  </td>
                </tr>
              ) : (
                voices.map((voice, index) => {
                  // Only apply search filter for display, but keep original index for drag and drop to work correctly
                  const matchesSearch = voice.name.toLowerCase().includes(searchQuery.toLowerCase()) || voice.role.toLowerCase().includes(searchQuery.toLowerCase())
                  if (searchQuery && !matchesSearch) return null;

                  return (
                  <tr 
                    key={voice.id} 
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`hover:bg-white/[0.02] transition-colors ${!voice.is_active ? 'opacity-50' : ''} ${draggedItemIndex === index ? 'opacity-30 bg-white/5' : ''}`}
                  >
                    <td className="p-4 cursor-grab active:cursor-grabbing text-gray-600">
                      <MoveVertical size={18} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#080b0f] relative shrink-0">
                          {voice.image_url ? (
                            <Image src={voice.image_url} alt={voice.name} fill className="object-cover" />
                          ) : (
                            <UserCircle className="w-full h-full text-gray-600 p-1" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {voice.name}
                            {!voice.is_active && (
                              <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Hidden</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{voice.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate">
                      "{voice.quote}"
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/5 text-xs font-mono text-gray-400">
                        {voice.sort_order}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {voice.details_link !== '#' && (
                          <a href={voice.details_link} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-white transition-colors" title="View Link">
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button 
                          onClick={() => openEditModal(voice)}
                          className="p-2 text-gray-500 hover:text-[#cfa861] transition-colors"
                          title="Edit Voice"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(voice.id)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VoiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        voice={editingVoice}
        onSuccess={fetchVoices}
      />
    </div>
  )
}
