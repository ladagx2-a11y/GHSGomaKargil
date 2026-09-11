'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

export function PrincipalMessage() {
  return (
    <section className="pb-24 relative overflow-hidden bg-white dark:bg-[#0a0f16] transition-colors duration-300">
      <div className="container mx-auto px-6 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="absolute -top-8 -left-8 text-[#8c6b32]/20 dark:text-[#8c6b32]/40">
            <Quote size={80} fill="currentColor" />
          </div>
          <div className="bg-white dark:bg-gradient-to-r dark:from-[#1a1f28] dark:to-[#111720] border border-black/5 dark:border-white/10 rounded-3xl p-10 md:p-14 shadow-2xl relative z-10 backdrop-blur-md">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'var(--font-lora)' }}>
              Welcome to Our School Community
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic mb-8">
              "Our mission at Government High School, Goma Kargil, is to spark a genuine passion for learning in every student. We aim to cultivate the academic competence, self-assurance, leadership, and creativity necessary for our youth to excel—not only in higher education and careers, but as thoughtful, contributing members of society."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8c6b32] to-[#a58145] flex items-center justify-center shadow-lg border-2 border-white/10">
                <span className="text-white font-bold text-xl">HM</span>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-bold text-lg">Headmaster</h4>
                <p className="text-[#8c6b32] dark:text-[#cfa861] text-sm">GHS Goma Kargil</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
