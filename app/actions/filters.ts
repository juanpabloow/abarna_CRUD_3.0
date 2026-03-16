'use server'

import { supabase } from '@/lib/supabase'

export async function getClientesForFilter() {
  const { data } = await supabase
    .from('clientes')
    .select('nit_id, nombre_empresa, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
  return data || []
}

export async function getSedesForFilter(clienteId?: string) {
  let query = supabase
    .from('sedes')
    .select('sede_id, nombre_sede, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')

  if (clienteId) {
    query = query.eq('nit_id', clienteId)
  }

  const { data } = await query
  return data || []
}

export async function getInstalacionesForFilter(sedeId?: string) {
  let query = supabase
    .from('instalaciones')
    .select('instalacion_id, codigo, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')

  if (sedeId) {
    query = query.eq('sede_id', sedeId)
  }

  const { data } = await query
  return data || []
}
