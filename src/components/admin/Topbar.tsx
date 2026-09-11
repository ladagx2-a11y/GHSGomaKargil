'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Search, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Topbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="h-20 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cfa861] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search records, notices..."
            className="w-full bg-[#111720] border border-white/5 rounded-full py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#8c6b32]/50 focus:ring-1 focus:ring-[#8c6b32]/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8c6b32] to-[#a58145] flex items-center justify-center shadow-lg">
            <User size={18} className="text-white" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="text-white font-semibold leading-tight">Admin User</p>
            <p className="text-gray-500 text-xs">System Administrator</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
