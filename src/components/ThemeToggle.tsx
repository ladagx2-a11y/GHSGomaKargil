'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-24 h-10 rounded-full bg-white/5 animate-pulse" />
  }

  return (
    <div className="flex items-center bg-white/5 dark:bg-[#111720] border border-black/10 dark:border-white/5 rounded-full p-1 relative">
      <button
        onClick={() => setTheme('light')}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === 'light' ? 'text-black' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === 'system' ? 'text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="System Preference"
      >
        <Monitor size={16} />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          theme === 'dark' ? 'text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>

      {/* Active Indicator Background */}
      <div 
        className="absolute top-1 bottom-1 w-8 bg-white dark:bg-[#1f2937] shadow-sm rounded-full transition-transform duration-300 ease-out z-0 border border-black/5 dark:border-white/5"
        style={{ 
          transform: `translateX(${theme === 'light' ? '0' : theme === 'system' ? '32px' : '64px'})` 
        }}
      />
    </div>
  )
}
