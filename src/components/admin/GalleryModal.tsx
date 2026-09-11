'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud, Save, Type, AlignLeft, Tag, Hash } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  image?: any
  onSuccess: () => void
}

const CATEGORIES = ['Campus', 'Academics', 'Events', 'Sports', 'Other']

export function GalleryModal({ isOpen, onClose, image, onSuccess }: GalleryModalProps) {
  const isEditing = !!image

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Campus',
    is_featured: true,
    sort_order: 0,
  })

  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: image?.title || '',
        description: image?.description || '',
        category: image?.category || 'Campus',
        is_featured: image?.is_featured ?? true,
        sort_order: image?.sort_order || 0,
      })
      setFiles([])
      setError(null)
    }
  }, [isOpen, image])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        let image_url = image?.image_url || ''
        
        if (files.length > 0) {
          const file = files[0]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
          image_url = publicUrl
        }
        
        const payload = { ...formData, image_url }
        const { error } = await supabase.from('gallery_images').update(payload).eq('id', image.id)
        if (error) throw error
      } else {
        if (files.length === 0) throw new Error('At least one image is required.')
        
        const payloads = []
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, file)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName)
          
          payloads.push({ ...formData, image_url: publicUrl })
        }
        
        const { error } = await supabase.from('gallery_images').insert(payloads)
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
            <UploadCloud className="text-[#8c6b32]" size={24} />
            {isEditing ? 'Edit Photo' : 'Upload Photo'}
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

          <form id="gallery-form" onSubmit={handleSave} className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Photo File</label>
              <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-[#8c6b32]/50 transition-colors text-center bg-[#080b0f] group cursor-pointer overflow-hidden">
                <input
                  type="file"
                  multiple={!isEditing}
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {files.length > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-lg bg-[#8c6b32]/20 flex items-center justify-center text-[#cfa861]">
                      <UploadCloud size={32} />
                    </div>
                    <span className="text-sm text-white font-medium truncate max-w-[200px]">
                      {files.length === 1 ? files[0].name : `${files.length} images selected`}
                    </span>
                    <span className="text-xs text-[#cfa861]">Click or drag to replace</span>
                  </div>
                ) : image?.image_url ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src={image.image_url} alt="Current" className="w-full h-32 object-contain rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs text-[#cfa861] font-bold">Click to replace current image</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-sm font-medium text-white">Choose a photo or drag it here</span>
                    <span className="text-xs">Supports JPG, PNG, WebP (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors"
                    placeholder="e.g. Science Fair 2026"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-4 text-gray-500" size={16} />
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#080b0f] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 transition-colors resize-none"
                  placeholder="Add context to this photo..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</label>
                <div className="flex items-center gap-3 bg-[#080b0f] border border-white/10 rounded-xl py-3 px-4">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-600 text-[#8c6b32] focus:ring-[#8c6b32] focus:ring-offset-gray-900 bg-gray-700"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-300">
                    Feature in Highlights
                  </label>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="gallery-form"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isEditing ? 'Save Changes' : 'Upload Photo'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
