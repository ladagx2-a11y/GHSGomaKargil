'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide the loader once the window has fully loaded,
    // or after a minimum safety timeout (e.g. 1.5 seconds) so it doesn't flash too fast.
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080b0f]"
        >
          {/* Subtle Background Glows */}
          <div className="absolute w-[400px] h-[400px] bg-[#8c6b32] rounded-full filter blur-[150px] opacity-[0.15] animate-pulse" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 mb-8 drop-shadow-[0_0_20px_rgba(140,107,50,0.5)]"
            >
              <Image src="/logo.png" alt="Loading Logo" fill className="object-contain" priority />
            </motion.div>
            
            {/* Dancing Dots */}
            <div className="flex items-center justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-[#cfa861] rounded-full"
                  animate={{ 
                    y: ['0%', '-100%', '0%'] 
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            
            {/* Text Loading */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-[#cfa861] text-xs font-bold tracking-[0.3em] uppercase"
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
