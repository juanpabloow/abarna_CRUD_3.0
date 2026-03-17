import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRoleRedirect } from '@/lib/auth'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const type = url.searchParams.get('type')
  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    if (type === 'invite') {
      return NextResponse.redirect(new URL('/auth/error?reason=invite_expired', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Invited users must set their password before we link and redirect
  if (type === 'invite') {
    return NextResponse.redirect(new URL('/auth/set-password', request.url))
  }

  // Link auth user to public.usuarios
  await supabase.rpc('link_usuario_with_auth')

  // Fetch role to determine redirect
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('auth_user_id', user.id)
    .single()

  if (!usuario) {
    return NextResponse.redirect(new URL('/auth/error', request.url))
  }

  return NextResponse.redirect(new URL(getRoleRedirect(usuario.rol), request.url))
}
