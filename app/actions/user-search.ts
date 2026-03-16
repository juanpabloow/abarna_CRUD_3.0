'use server'

import { supabase } from '@/lib/supabase'

export async function searchUsuarios(query: string, rol?: string) {
  let dbQuery = supabase
    .from('usuarios')
    .select('usuario_id, nombre_completo, email, rol')
    .eq('estados_crud.estado_crud', 'Activo')
    
  // Subquery for active status filter
  dbQuery = dbQuery.select('*, estados_crud!inner(estado_crud)')

  if (rol) {
    dbQuery = dbQuery.eq('rol', rol)
  }

  if (query) {
    dbQuery = dbQuery.or(`nombre_completo.ilike.%${query}%,email.ilike.%${query}%,cedula.ilike.%${query}%`)
  }

  const { data } = await dbQuery.limit(10)
  
  return data || []
}
