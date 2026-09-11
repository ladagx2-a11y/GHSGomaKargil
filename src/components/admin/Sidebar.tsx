'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { FileText, LayoutDashboard, Settings, Bell, Newspaper, Image as ImageIcon, UserCircle } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Hero Carousel', href: '/admin/hero', icon: ImageIcon },
  { label: 'News & Stories', href: '/admin/news', icon: Newspaper },
  { label: 'Public Records', href: '/admin/records', icon: FileText },
  { label: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
  { label: 'Community Voices', href: '/admin/voices', icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0b0f14] border-r border-white/5 hidden lg:flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'var(--font-lora)' }}>Admin Portal</h2>
            <p className="text-[#cfa861] text-[10px] uppercase tracking-wider">GHS Goma Kargil</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 mt-4">Management</div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          // Special exact check for dashboard root
          const isExactDashboard = item.href === '/admin' && pathname === '/admin'
          const finalActive = item.href === '/admin' ? isExactDashboard : isActive

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                finalActive
                  ? 'bg-gradient-to-r from-[#8c6b32]/20 to-transparent text-[#e8cc94] font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={finalActive ? 'text-[#cfa861]' : 'text-gray-500'} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <button 
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/admin/login'
          }}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          Logout
        </button>

        <div className="bg-[#111720] rounded-xl p-4 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#8c6b32] rounded-full filter blur-[20px] opacity-20 translate-x-1/2 -translate-y-1/2" />
          <h4 className="text-white text-xs font-bold mb-1">System Status</h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 text-[10px] uppercase tracking-wider">Secure Connection</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
