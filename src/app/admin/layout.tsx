'use client'

import { usePathname } from 'next/navigation'
import { AuthGuard } from '@/components/admin/AuthGuard'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#080b0f] flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-10">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
