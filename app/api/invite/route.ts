import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // 1. Verify the caller is authenticated and is an admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })
  }

  const { data: caller } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('auth_user_id', user.id)
    .single()

  if (!caller || caller.rol !== 'admin') {
    return NextResponse.json(
      { error: 'Solo los administradores pueden enviar invitaciones.' },
      { status: 403 }
    )
  }

  // 2. Parse body
  let usuario_id: string | undefined
  try {
    const body = await request.json()
    usuario_id = body.usuario_id
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 })
  }

  if (!usuario_id) {
    return NextResponse.json({ error: 'usuario_id es requerido.' }, { status: 400 })
  }

  // 3. Fetch the target usuario
  const { data: target } = await supabase
    .from('usuarios')
    .select('email, auth_user_id, nombre_completo')
    .eq('usuario_id', usuario_id)
    .single()

  if (!target) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })
  }

  if (!target.email) {
    return NextResponse.json(
      { error: 'Este usuario no tiene correo electrónico registrado.' },
      { status: 400 }
    )
  }

  if (target.auth_user_id) {
    return NextResponse.json(
      { error: 'Este usuario ya tiene una cuenta activa.' },
      { status: 409 }
    )
  }

  // 4. Send invite via service-role client (never expose this key to the browser)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('[invite] SUPABASE_SERVICE_ROLE_KEY is not set')
    return NextResponse.json(
      { error: 'Configuración de servidor incompleta. Contacta al desarrollador.' },
      { status: 500 }
    )
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(target.email)

  if (inviteError) {
    // Supabase returns this when the email is already registered in Auth
    if (inviteError.message.toLowerCase().includes('already been registered')) {
      return NextResponse.json(
        {
          error:
            'Este correo ya está registrado en el sistema de autenticación. ' +
            'Si el usuario nunca activó su cuenta, solicítale que revise su bandeja de entrada o carpeta de spam ' +
            'por un enlace anterior, o elimina su cuenta en Supabase Auth y reenvía la invitación.',
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: inviteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
