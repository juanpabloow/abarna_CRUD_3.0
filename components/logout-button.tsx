'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Cerrar sesión
    </Button>
  )
}
