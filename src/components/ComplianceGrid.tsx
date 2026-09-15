'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, FileText, CheckCircle, ExternalLink, X, FileBadge } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Document = {
  id: string
  title: string
  category: string
  document_number: string
  issuing_authority: string
  issue_date: string
  expiry_date: string | null
  file_url: string
  is_verified: boolean
  status: string
}


export function ComplianceGrid() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('compliance_documents')
      .select('*')
      .eq('status', 'active')
      .order('issue_date', { ascending: false })

    if (!error && data) {
      setDocuments(data)
    } else {
      setDocuments([])
    }
    setLoading(false)
  }

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || 
                          doc.document_number.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-[#2a3644] dark:border-[#cfa861] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-[#1a2230] py-16 rounded-2xl text-center border border-gray-100 dark:border-white/5 shadow-sm">
          <FileText className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-[#2a3644] dark:text-white">No documents found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                {(() => {
                  const filePart = doc.file_url.split('/').pop()?.replace('.pdf', '') || ''
                  const isRandomNumber = /^0\.\d{10,}$/.test(filePart)
                  const slug = isRandomNumber ? doc.title.replace(/[^a-zA-Z0-9]/g, '') : filePart
                  
                  return (
                    <a 
                      href={doc.file_url !== '#' ? `/${slug}` : undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center p-5 bg-white dark:bg-[#1a2230] hover:bg-gray-50 dark:hover:bg-[#202938] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
                    >
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#2a3644] dark:text-white font-bold text-lg truncate group-hover:text-blue-500 dark:group-hover:text-[#cfa861] transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-[#556372] dark:text-gray-400 text-sm mt-0.5 truncate">
                      {doc.document_number} &bull; {doc.issuing_authority}
                    </p>
                  </div>
                  <div className="ml-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-[#cfa861] transition-colors shrink-0">
                    <ExternalLink size={20} />
                  </div>
                </a>
                )
              })()}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
