'use client'

import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { GalleryModal } from '@/components/admin/GalleryModal'

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<any>(null)

  const fetchImages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (data && !error) setImages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return
    
    await supabase.from('gallery_images').delete().eq('id', id)
    fetchImages()
  }

  const openAddModal = () => {
    setEditingImage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (img: any) => {
    setEditingImage(img)
    setIsModalOpen(true)
  }

  const filteredImages = images.filter(img => 
    img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    img.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-lora)' }}>Photo Gallery</h1>
          <p className="text-gray-400 text-sm">Manage the dynamic photo gallery shown on the public site.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Plus size={16} />
          Upload Photo
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-[#111720] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080b0f] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8c6b32]/50"
          />
        </div>
        <div className="text-xs text-gray-500 ml-auto">
          {filteredImages.length} photos
        </div>
      </div>

      {/* Categorized Tile Grid */}
      {loading ? (
        <div className="py-32 flex justify-center">
          <Loader2 className="animate-spin text-[#8c6b32]" size={32} />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="py-32 text-center text-gray-500 bg-[#111720] rounded-2xl border border-white/5">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p>No photos found.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(
            filteredImages.reduce((acc: Record<string, any[]>, img: any) => {
              if (!acc[img.category]) acc[img.category] = []
              acc[img.category].push(img)
              return acc
            }, {})
          ).map(([category, imgs]: [string, any[]]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <h3 className="text-xl font-bold text-white tracking-wide">{category}</h3>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{imgs.length}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {imgs.map((img: any) => (
                  <div key={img.id} className="group relative bg-[#111720] rounded-xl overflow-hidden aspect-square border border-white/5">
                    {img.image_url ? (
                      <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#080b0f]">
                        <ImageIcon className="text-gray-600 opacity-20" size={48} />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2 mb-1">{img.title}</h4>
                        {img.is_featured && (
                          <span className="inline-block text-[10px] bg-[#8c6b32]/20 text-[#cfa861] border border-[#8c6b32]/30 px-2 py-0.5 rounded uppercase tracking-widest font-bold">Featured</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(img)} 
                          className="p-2 bg-white/10 hover:bg-[#cfa861] text-white hover:text-black rounded-lg transition-colors"
                          title="Edit Photo"
                        >
                          <Edit2 size={14}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(img.id)} 
                          className="p-2 bg-white/10 hover:bg-red-500 text-white hover:text-white rounded-lg transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={editingImage}
        onSuccess={fetchImages}
      />
    </div>
  )
}
