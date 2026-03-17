'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createSede(formData: FormData) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const assignedUsers = formData.getAll('assigned_users') as string[]

  const newSede = {
    nit_id: formData.get('nit_id'),
    nombre_sede: formData.get('nombre_sede')?.toString(),
    direccion: formData.get('direccion')?.toString() || null,
    ciudad_id: formData.get('ciudad_id'),
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { data: insertData, error: sedeError } = await supabase
    .from('sedes')
    .insert([newSede])
    .select('sede_id')
    .single()

  if (sedeError || !insertData) {
    console.error('Error creating sede:', sedeError)
    throw new Error(sedeError?.message || 'Failed to create')
  }

  if (assignedUsers.length > 0) {
    const relationships = assignedUsers.map(userId => ({
      sede_id: insertData.sede_id,
      usuario_id: userId,
      tipo_relacion: 'encargado_sede',
      es_principal: false,
      estado_crud_id: estadoData?.estado_crud_id
    }))

    const { error: relError } = await supabase.from('sede_usuarios').insert(relationships)
    if (relError) console.error('Error linking users to sede:', relError)
  }

  revalidatePath('/sedes')
  redirect('/sedes')
}

export async function updateSede(sedeId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const assignedUsers = formData.getAll('assigned_users') as string[]

  const updatedSede = {
    nit_id: formData.get('nit_id'),
    nombre_sede: formData.get('nombre_sede')?.toString(),
    direccion: formData.get('direccion')?.toString() || null,
    ciudad_id: formData.get('ciudad_id')
  }

  const { error: sedeError } = await supabase
    .from('sedes')
    .update(updatedSede)
    .eq('sede_id', sedeId)

  if (sedeError) {
    console.error('Error updating sede:', sedeError)
    throw new Error(sedeError.message)
  }

  await supabase.from('sede_usuarios').delete().eq('sede_id', sedeId)

  if (assignedUsers.length > 0) {
    const relationships = assignedUsers.map(userId => ({
      sede_id: sedeId,
      usuario_id: userId,
      tipo_relacion: 'encargado_sede',
      es_principal: false,
      estado_crud_id: estadoData?.estado_crud_id
    }))

    const { error: relError } = await supabase.from('sede_usuarios').insert(relationships)
    if (relError) console.error('Error linking users on update sede:', relError)
  }

  revalidatePath('/sedes')
  redirect('/sedes')
}

export async function deleteSede(sedeId: string) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Eliminado')
    .single()

  if (estadoData) {
    await supabase.from('sedes').update({ estado_crud_id: estadoData.estado_crud_id }).eq('sede_id', sedeId)
    revalidatePath('/sedes')
  }
}
