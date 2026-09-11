'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DocumentModal } from '@/components/admin/DocumentModal'

export default function RecordsManagement() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<any>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('compliance_documents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data && !error) setDocuments(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    await supabase.from('compliance_documents').delete().eq('id', id)
    fetchDocuments()
  }

  const openAddModal = () => {
    setEditingDoc(null)
    setIsModalOpen(true)
  }

  const openEditModal = (doc: any) => {
    setEditingDoc(doc)
    setIsModalOpen(true)
  }

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.document_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: 'var(--font-lora)' }}>Public Records</h1>
          <p className="text-gray-400 text-sm">Manage compliance documents and certifications.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-[#8c6b32] to-[#a58145] hover:from-[#a58145] hover:to-[#8c6b32] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <Plus size={16} />
          Add Record
        </button>
      </div>

      <div className="bg-[#111720] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by title or document ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080b0f] border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#8c6b32]/50"
            />
          </div>
          <div className="text-xs text-gray-500">
            Showing {filteredDocs.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Document</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Date</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
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
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="text-white text-sm font-semibold mb-1">{doc.title}</p>
                      <p className="text-gray-500 text-xs font-mono">{doc.document_number}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-md">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(doc.issue_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        doc.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : doc.status === 'archived'
                            ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          doc.status === 'active' ? 'bg-emerald-400' : doc.status === 'archived' ? 'bg-gray-400' : 'bg-amber-400'
                        }`} />
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors">
                          <ExternalLink size={14} />
                        </a>
                        <button onClick={() => openEditModal(doc)} className="p-2 text-gray-400 hover:text-[#e8cc94] bg-white/5 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors">
                          <Trash2 size={14} />
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

      {isModalOpen && (
        <DocumentModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          document={editingDoc} 
          onSuccess={fetchDocuments}
        />
      )}
    </div>
  )
}
