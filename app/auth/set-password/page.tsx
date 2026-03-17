'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRoleRedirect } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound } from 'lucide-react'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    // Link auth user to public.usuarios row
    await supabase.rpc('link_usuario_with_auth')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('auth_user_id', user.id)
      .single()

    if (!usuario) {
      // Sign out first so middleware blocks all protected routes after redirect.
      await supabase.auth.signOut()
      router.push('/auth/error')
      return
    }

    router.push(getRoleRedirect(usuario.rol))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="pb-2 text-center">
          <div className="flex justify-center mb-2">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-lg">Activar cuenta</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Establece una contraseña para completar la activación de tu cuenta.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                required
                minLength={8}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Activando...' : 'Activar cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
