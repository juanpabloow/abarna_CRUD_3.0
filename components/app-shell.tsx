'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { GlobalModals } from '@/components/global-modals'
import { Suspense } from 'react'

const AUTH_PATHS = ['/login', '/auth/']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p))

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-y-auto w-full">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
            <h1 className="text-sm font-semibold text-slate-800">Panel de Administración</h1>
          </header>
          <main className="flex-1 p-6 z-10">
            {children}
          </main>
        </div>
      </div>
      <Suspense fallback={null}>
        <GlobalModals />
      </Suspense>
    </>
  )
}
