'use client'

import { FileText } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ComplianceGrid } from '@/components/ComplianceGrid'

export default function RecordsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0b0f14] transition-colors">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 bg-[#004e89] dark:bg-[#080b0f] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00a8cc]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto relative z-10 pt-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText size={16} className="text-[#00a8cc] dark:text-[#cfa861]" />
            <span className="text-white/80 dark:text-[#cfa861] text-sm font-bold tracking-[0.2em] uppercase">Transparency</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight" style={{ fontFamily: 'var(--font-lora)' }}>
            Public Records
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Easily access official school policies, affiliation certificates, academic calendars, and other important public documents.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 flex-grow">
        <div className="container mx-auto max-w-6xl">
          <ComplianceGrid />
        </div>
      </section>

      <Footer />
    </div>
  )
}
