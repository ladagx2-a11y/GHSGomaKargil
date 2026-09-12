'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] pt-16 pb-8 px-6 overflow-hidden">
      {/* Background Image & Dark Blue Shade */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=3000&h=800&fit=crop&crop=top" 
          alt="Spring Blossoms Background" 
          fill 
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#082a56]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04152d] via-[#04152d]/90 to-transparent" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          {/* School Info */}
          <div>
            <div className="w-20 h-20 relative mb-5 drop-shadow-[0_0_10px_rgba(140,107,50,0.5)]">
              <Image src="/logo.png" alt="Government High School Logo" fill sizes="80px" className="object-contain" />
            </div>
            <h3 className="text-white font-extrabold text-xl mb-1 drop-shadow-md" style={{ fontFamily: 'var(--font-lora)' }}>Government High School</h3>
            <p className="text-[#cfa861] font-bold text-lg tracking-wide drop-shadow-md mb-2" style={{ fontFamily: 'var(--font-lora)' }}>Goma Kargil, Ladakh</p>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin size={16} className="shrink-0 text-[#6ebcb5] mt-0.5" />
              <span>Goma, Kargil District, Ladakh, 194103, India</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Quick Links</h4>
            <div className="space-y-2.5">
              {[
                { label: 'About Us', href: '/#about' },
                { label: 'News', href: '/news' },
                { label: 'Records', href: '/records' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Admin Portal', href: '/admin' },
              ].map(link => (
                <a key={link.label} href={link.href} className="block text-gray-400 hover:text-[#6ebcb5] text-sm transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="shrink-0 text-[#6ebcb5]" />
                <span>+91 1985 XXXXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="shrink-0 text-[#6ebcb5]" />
                <a href="mailto:hsgoma12@gmail.com" className="hover:text-white transition-colors">hsgoma12@gmail.com</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="shrink-0 text-[#6ebcb5]" />
                <span>Mon – Sat, 8:00 AM – 3:00 PM</span>
              </div>
            </div>
            
            {/* Theme Toggle & Socials */}
            <div className="mt-8 flex items-center gap-4">
              <ThemeToggle />
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#cfa861] hover:text-black hover:border-transparent transition-all shadow-sm" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Government High School Goma Kargil. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Made with <span className="text-red-500 mx-0.5">❤️</span> in Ladakh by <a href="https://ladagx.com" target="_blank" rel="noreferrer" className="text-gray-400 font-bold hover:text-white transition-colors">Ladagx</a>
            </p>
            <div className="hidden sm:block w-[1px] h-3 bg-white/10" />
            <Link href="/admin" className="text-gray-500 text-xs font-bold hover:text-[#cfa861] transition-colors uppercase tracking-widest">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
