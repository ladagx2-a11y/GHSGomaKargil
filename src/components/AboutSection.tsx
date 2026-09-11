'use client'

import { motion } from 'framer-motion'
import { BookOpen, GraduationCap, Users, Heart, Quote } from 'lucide-react'

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-[#0a0f16] transition-colors duration-300">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8c6b32] rounded-full filter blur-[200px] opacity-[0.07] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#00a8cc] rounded-full filter blur-[250px] opacity-[0.04] pointer-events-none" />
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#eaeaea] dark:from-[#0a0f16] to-transparent z-10" />

      <div className="container mx-auto px-6 relative z-20">
        
        {/* Unified Vision Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="text-[#8c6b32] dark:text-[#cfa861] text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Our Vision
          </h3>
          
          <h2 
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8c6b32] via-[#2a3644] to-[#a58145] dark:from-[#e8cc94] dark:via-white dark:to-[#cfa861] tracking-tight drop-shadow-sm dark:drop-shadow-md mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-lora)' }}
          >
            Educate. Empower. Elevate.
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
            Welcome to <span className="text-gray-900 dark:text-white font-semibold">Government High School, Goma Kargil</span>. We blend academic rigor with strong community values, providing a safe and inspiring environment where young minds develop into curious, confident, and lifelong learners.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
