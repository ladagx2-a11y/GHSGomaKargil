'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About Us', href: '/#about' },
  { label: 'News', href: '/news' },
  { label: 'Records', href: '/records' },
  { label: 'Gallery', href: '/gallery' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
      scrolled 
        ? 'bg-white/80 dark:bg-[#0b0f14]/90 backdrop-blur-xl border-black/10 dark:border-white/5 shadow-lg' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between h-20 md:h-24">
        {/* Logo as Home Link */}
        <Link href="/" className="flex items-center gap-3 md:gap-4 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] relative shrink-0 drop-shadow-[0_0_10px_rgba(140,107,50,0.5)] transition-all">
            <Image src="/logo.png" alt="Government High School" fill sizes="(max-width: 768px) 56px, 70px" className="object-contain" />
          </div>
          <div className="hidden sm:block">
            <p className={`${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'} font-bold text-sm md:text-base lg:text-lg leading-tight tracking-wide drop-shadow-sm dark:drop-shadow-md transition-colors`} style={{ fontFamily: 'var(--font-lora)' }}>Government High School</p>
            <p className="text-[#cfa861] font-bold text-sm md:text-base lg:text-lg leading-tight tracking-wide drop-shadow-md mt-0.5" style={{ fontFamily: 'var(--font-lora)' }}>Goma Kargil, Ladakh</p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map(link => (
            <Link 
              key={link.label}
              href={link.href} 
              className={`relative py-2 text-lg lg:text-xl font-bold transition-colors group tracking-wide ${
                scrolled 
                  ? 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white' 
                  : 'text-gray-200 hover:text-white'
              }`}
              style={{ fontFamily: 'var(--font-lora)' }}
            >
              {link.label}
              <span className="absolute left-0 bottom-1 w-full h-[2px] bg-[#cfa861] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Mobile Toggle & Theme */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className={`p-2 transition-colors relative z-50 ${(scrolled || mobileOpen) ? 'text-gray-900 dark:text-gray-100 hover:text-[#cfa861]' : 'text-white hover:text-[#cfa861]'}`}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#0b0f14]/95 backdrop-blur-2xl flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-8 w-full px-6">
            {navLinks.map((link, index) => (
              <Link 
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-gray-900 dark:text-white hover:text-[#cfa861] dark:hover:text-[#cfa861] transition-colors"
                style={{ 
                  fontFamily: 'var(--font-lora)',
                  animation: `slideUp 0.4s ease-out ${index * 0.1}s both` 
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="absolute bottom-12 text-center" style={{ animation: 'slideUp 0.4s ease-out 0.6s both' }}>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">Government High School</p>
            <p className="text-[#cfa861] text-xs font-bold tracking-[0.2em] uppercase">Learn · Grow · Serve</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </nav>
  )
}
