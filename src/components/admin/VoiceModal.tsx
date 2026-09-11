'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud, Save, User, UserCircle, MessageSquare, Link as LinkIcon, Hash } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
  voice?: any
  onSuccess: () => void
}

export function VoiceModal({ isOpen, onClose, voice, onSuccess }: VoiceModalProps) {
  const isEditing = !!voice

  const [formData, setFormData] = useState({
    name: voice?.name || '',
    role: voice?.role || '',
    quote: voice?.quote || '',
    details_link: voice?.details_link || '#',
    sort_order: voice?.sort_order || 0,
    is_active: voice?.is_active ?? true,
  })
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: voice?.name || '',
        role: voice?.role || '',
        quote: voice?.quote || '',
        details_link: voice?.details_link || '#',
        sort_order: voice?.sort_order || 0,
        is_active: voice?.is_active ?? true,
      })
      setFile(null)
      setError(null)
    }
  }, [isOpen, voice])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let image_url = voice?.image_url || ''

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('voices_images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('voices_images')
          .getPublicUrl(filePath)
          
        image_url = publicUrl
      }

      if (!isEditing && !image_url) {
        throw new Error('A photo is required for new community voices.')
      }

      const payload = {
        ...formData,
        image_url,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('community_voices')
          .update(payload)
          .eq('id', voice.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('community_voices')
          .insert([payload])
        if (error) throw error
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-[#111720] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-lora)' }}>
            <UserCircle className="text-[#8c6b32]" size={24} />
            {isEditing ? 'Edit Community Voice' : 'Add Community Voice'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form id="voice-form" onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors"
                    placeholder="e.g. Jessica Schmidt"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role / Title</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors"
                    placeholder="e.g. First Grade Teacher"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quote / Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-4 text-gray-500" size={16} />
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                  className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors resize-none"
                  placeholder="Enter their inspirational quote..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Details Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.details_link}
                    onChange={e => setFormData({...formData, details_link: e.target.value})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors"
                    placeholder="e.g. # or /staff/jessica"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort Order (Lower = First)</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Photo</label>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 bg-[#080b0f] text-center hover:bg-white/[0.02] transition-colors group">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} className="text-[#8c6b32]" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {file ? file.name : (isEditing ? 'Click to upload a new photo' : 'Click or drag a photo here')}
                  </span>
                  <span className="text-xs text-gray-500">Max 5MB. JPEG, PNG, WEBP.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8c6b32]"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">Visible on website</span>
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            form="voice-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Voice
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
