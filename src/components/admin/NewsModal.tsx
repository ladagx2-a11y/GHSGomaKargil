'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface NewsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingStory?: any
}

export function NewsModal({ isOpen, onClose, onSuccess, editingStory }: NewsModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    is_published: true
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingStory) {
      setFormData({
        title: editingStory.title,
        summary: editingStory.summary,
        content: editingStory.content,
        image_url: editingStory.image_url || '',
        is_published: editingStory.is_published
      })
    } else {
      setFormData({ title: '', summary: '', content: '', image_url: '', is_published: true })
    }
    setError('')
  }, [editingStory, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError('')
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('news_images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('news_images')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (err: any) {
      console.error('Upload Error:', err)
      setError(err.message || 'Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (editingStory) {
        const { error } = await supabase
          .from('news_stories')
          .update(formData)
          .eq('id', editingStory.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('news_stories')
          .insert([formData])
        if (error) throw error
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Submit Error:', err)
      setError(err.message || 'Error saving story')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111720] border border-[#333] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-[#222]">
          <h2 className="text-xl font-bold text-white">{editingStory ? 'Edit Story' : 'Create New Story'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form id="news-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image</label>
              <div 
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${formData.image_url ? 'border-transparent bg-black/40' : 'border-[#333] hover:border-[#6ebcb5]/50 bg-[#1a1a1a]'}`}
              >
                {formData.image_url ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                    <img src={formData.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-bold flex items-center gap-2"
                      >
                        <Upload size={16} /> Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500">
                      {uploadingImage ? <Loader2 className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="text-[#6ebcb5] font-bold text-sm hover:underline"
                    >
                      Click to upload cover image
                    </button>
                    <p className="text-gray-500 text-xs mt-1">JPEG, PNG, or WEBP. Max 2MB.</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Story Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6ebcb5] transition-colors"
                  placeholder="E.g., Science Fair 2026 Highlights"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Short Summary (For Card)</label>
                <textarea 
                  required
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6ebcb5] transition-colors resize-none h-24"
                  placeholder="A brief 1-2 sentence description..."
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Story Content (Plain Text Format)</label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6ebcb5] transition-colors h-64"
                  placeholder="Write the full story here... Use empty lines to separate paragraphs."
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={e => setFormData({...formData, is_published: e.target.checked})}
                  className="w-5 h-5 rounded bg-[#1a1a1a] border-[#333] text-[#6ebcb5] focus:ring-[#6ebcb5] focus:ring-offset-0"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-300">Publish Immediately</label>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-[#222] flex justify-end gap-3 bg-[#161d27] rounded-b-2xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-300 font-bold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="news-form"
            disabled={loading || uploadingImage}
            className="bg-[#6ebcb5] hover:bg-[#5daea7] text-[#0b0f14] px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : 'Save Story'}
          </button>
        </div>
      </div>
    </div>
  )
}
