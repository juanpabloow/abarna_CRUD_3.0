'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTipoPersonas() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tipo_personas')
    .select('tipo_persona_id, tipo_persona, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
  return data || []
}

export async function getFuentesForSelect() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('fuentes')
    .select('fuente_id, fuente, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
  return data || []
}

export async function getCiudadesForSelect() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ciudades')
    .select('ciudad_id, ciudad, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
    .order('ciudad')
  return data || []
}

export async function getClientesForSelect() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clientes')
    .select('nit_id, nombre_empresa, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
    .order('nombre_empresa')
  return data || []
}
