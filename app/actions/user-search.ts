'use server'

import { createClient } from '@/lib/supabase/server'

export async function searchUsuarios(query: string, rol?: string) {
  const supabase = await createClient()
  let dbQuery = supabase
    .from('usuarios')
    .select('*, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')

  if (rol) {
    dbQuery = dbQuery.eq('rol', rol)
  }

  if (query) {
    dbQuery = dbQuery.or(`nombre_completo.ilike.%${query}%,email.ilike.%${query}%,cedula.ilike.%${query}%`)
  }

  const { data } = await dbQuery.limit(10)

  return data || []
}
