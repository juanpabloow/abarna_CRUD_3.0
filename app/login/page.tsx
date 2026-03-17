'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRoleRedirect } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  // Handle implicit-flow invite/recovery links (Supabase sends #access_token=...&type=invite to Site URL)
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const params = new URLSearchParams(hash.slice(1))
    const type = params.get('type')
    if (type !== 'invite' && type !== 'recovery') return

    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (!accessToken || !refreshToken) return

    // Explicitly set the session so the SSR cookie is written before navigation.
    // Without this, middleware sees no session and blocks /auth/set-password.
    const supabase = createClient()
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (!error) router.replace('/auth/set-password')
      })
  }, [router])
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    // Link auth user to public.usuarios if not yet linked
    await supabase.rpc('link_usuario_with_auth')

    // Fetch role from public.usuarios
    const { data: { user } } = await supabase.auth.getUser()
    let redirectTo = '/'

    if (user) {
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('auth_user_id', user.id)
        .single()

      if (usuario) {
        redirectTo = getRoleRedirect(usuario.rol)
      } else {
        // Authenticated in Supabase Auth but no linked public.usuarios row.
        // Sign out first so middleware blocks all protected routes after redirect.
        await supabase.auth.signOut()
        router.push('/auth/error')
        return
      }
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="space-y-1 pb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Abarna Admin
          </h2>
          <CardTitle className="text-lg font-semibold">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
