'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { HeroModal } from '@/components/admin/HeroModal'

export default function HeroManagement() {
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<any>(null)
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

  const fetchSlides = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (data && !error) setSlides(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return
    
    await supabase.from('hero_slides').delete().eq('id', id)
    fetchSlides()
  }

  const openAddModal = () => {
    setEditingSlide(null)
    setIsModalOpen(true)
  }

  const openEditModal = (slide: any) => {
    setEditingSlide(slide)
    setIsModalOpen(true)
  }

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return

    // Reorder the array locally
    const newSlides = [...slides]
    const draggedItem = newSlides[draggedItemIndex]
    newSlides.splice(draggedItemIndex, 1)
    newSlides.splice(index, 0, draggedItem)
    
    setDraggedItemIndex(index)
    setSlides(newSlides)
  }

  const handleDragEnd = async () => {
    setDraggedItemIndex(null)
    
    // Save new sort order to Supabase
    // We update each slide's sort_order to match its new index in the array
    const updates = slides.map((slide, index) => ({
      id: slide.id,
      title: slide.title,
      label: slide.label,
      image_url: slide.image_url,
      is_active: slide.is_active,
      sort_order: index, // New order
    }))

    // Upsert all updates
    await supabase.from('hero_slides').upsert(updates)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-lora)' }}>Hero Carousel</h1>
          <p className="text-gray-400 text-sm">Drag and drop the slides to arrange their order on the homepage.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#6ebcb5] hover:bg-[#5daea7] text-[#0b0f14] px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#6ebcb5]/20"
        >
          <Plus size={20} /> Add New Slide
        </button>
      </div>

      <div className="bg-[#111720] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a2230] border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 w-10"></th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Main Title & Label</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 pr-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-[#6ebcb5] border-t-transparent rounded-full animate-spin" />
                      Loading slides...
                    </div>
                  </td>
                </tr>
              ) : slides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="bg-black/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                    <p className="font-medium text-white mb-1">No slides configured</p>
                    <p className="text-sm">Click "Add New Slide" to start building your carousel.</p>
                  </td>
                </tr>
              ) : (
                slides.map((slide, index) => (
                  <tr 
                    key={slide.id} 
                    className={`hover:bg-white/5 transition-colors group ${draggedItemIndex === index ? 'opacity-50 bg-[#6ebcb5]/10' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <td className="p-4 pl-6 cursor-grab active:cursor-grabbing text-gray-600 group-hover:text-white transition-colors">
                      <GripVertical size={20} />
                    </td>
                    <td className="p-4">
                      {slide.image_url ? (
                        <div className="w-24 h-16 rounded-lg bg-[#1a2230] overflow-hidden border border-white/10 relative">
                          <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-lg bg-[#1a2230] flex items-center justify-center border border-white/10 text-gray-600">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white mb-1 group-hover:text-[#6ebcb5] transition-colors text-lg" style={{ fontFamily: 'var(--font-lora)' }}>
                        {slide.title}
                      </p>
                      <p className="text-xs text-gray-500 max-w-sm uppercase tracking-widest">{slide.label}</p>
                    </td>
                    <td className="p-4">
                      {slide.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1a4f36]/30 text-[#6ebcb5] border border-[#6ebcb5]/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6ebcb5]" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex justify-end items-center gap-2">
                        <button 
                          onClick={() => openEditModal(slide)}
                          title="Edit Slide"
                          className="p-2 text-gray-400 hover:text-[#cfa861] bg-white/5 hover:bg-[#cfa861]/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(slide.id)}
                          title="Delete Slide"
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

      <HeroModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSlides}
        editingSlide={editingSlide}
      />
    </div>
  )
}
