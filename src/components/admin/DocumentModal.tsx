'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, UploadCloud, FileType, Calendar, Hash, Tag, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  document?: any
  onSuccess: () => void
}

export function DocumentModal({ isOpen, onClose, document, onSuccess }: DocumentModalProps) {
  const isEditing = !!document

  const [formData, setFormData] = useState({
    title: document?.title || '',
    category: document?.category || 'NOC',
    document_number: document?.document_number || '',
    issuing_authority: document?.issuing_authority || '',
    issue_date: document?.issue_date || '',
    status: document?.status || 'active',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let file_url = document?.file_url || ''

      if (file) {
        // Clean original filename: replace spaces with underscores, keep alphanumerics and dots
        const cleanName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '')
        const filePath = `documents/${cleanName}`

        const { error: uploadError, data } = await supabase.storage
          .from('public-documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('public-documents')
          .getPublicUrl(filePath)
          
        file_url = publicUrl
      }

      if (!isEditing && !file_url) {
        throw new Error('A PDF document file is required for new records.')
      }

      const payload = {
        ...formData,
        file_url,
        is_verified: true,
      }

      if (isEditing) {
        const { error } = await supabase
          .from('compliance_documents')
          .update(payload)
          .eq('id', document.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('compliance_documents')
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#0d1117] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#111720]">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-lora)' }}>
            {isEditing ? 'Edit Public Record' : 'Add New Public Record'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          <form id="doc-form" onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#161c24] border border-white/5 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-[#8c6b32]/50"
                  placeholder="e.g. Environmental NOC 2024"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#161c24] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 appearance-none"
                  >
                    <option value="NOC">NOC</option>
                    <option value="Affiliation">Affiliation</option>
                    <option value="Safety">Safety / Fire</option>
                    <option value="Land">Land Certificate</option>
                    <option value="Tender">Government Tender</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Document Number / ID</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.document_number}
                    onChange={e => setFormData({ ...formData, document_number: e.target.value })}
                    className="w-full bg-[#161c24] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50"
                    placeholder="e.g. NOC-24-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issuing Authority</label>
                <div className="relative">
                  <FileType className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={formData.issuing_authority}
                    onChange={e => setFormData({ ...formData, issuing_authority: e.target.value })}
                    className="w-full bg-[#161c24] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50"
                    placeholder="e.g. Dept of Education"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issue Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full bg-[#161c24] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#8c6b32]/50 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                <div className="flex gap-4">
                  {['active', 'draft', 'archived'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${formData.status === status ? 'border-[#8c6b32]' : 'border-gray-500 group-hover:border-gray-400'}`}>
                        {formData.status === status && <div className="w-2 h-2 rounded-full bg-[#cfa861]" />}
                      </div>
                      <span className="text-sm text-gray-300 capitalize">{status}</span>
                      <input 
                        type="radio" 
                        name="status" 
                        value={status} 
                        checked={formData.status === status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="hidden" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upload PDF Document</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl bg-[#161c24] hover:bg-white/5 hover:border-[#8c6b32]/50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[#cfa861] mb-2 transition-colors" />
                    <p className="mb-1 text-sm text-gray-400 group-hover:text-gray-300">
                      <span className="font-semibold text-white">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF documents only (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && (
                  <div className="mt-2 text-sm text-[#cfa861] flex items-center gap-2 bg-[#8c6b32]/10 p-2 rounded-lg border border-[#8c6b32]/20">
                    <FileType size={14} />
                    {file.name}
                  </div>
                )}
                {isEditing && !file && document.file_url && (
                  <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                    <FileType size={14} />
                    Current file: <a href={document.file_url} target="_blank" rel="noreferrer" className="text-[#6ebcb5] hover:underline">View PDF</a>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mt-4">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#111720] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="doc-form"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Record
          </button>
        </div>
      </motion.div>
    </div>
  )
}
