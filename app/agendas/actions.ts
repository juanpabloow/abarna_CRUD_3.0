'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createAgenda(formData: FormData) {
  const assignedTecnicos = formData.getAll('assigned_tecnicos') as string[]

  const newAgenda = {
    instalacion_id: formData.get('instalacion_id'),
    fecha_visita: formData.get('fecha_visita')?.toString(),
    tipo_servicio: formData.get('tipo_servicio')?.toString(),
    descripcion: formData.get('descripcion')?.toString() || null,
    estatus: formData.get('estatus')?.toString() || 'programada'
  }

  const { data: insertData, error: agendaError } = await supabase
    .from('agendas')
    .insert([newAgenda])
    .select('agenda_id')
    .single()

  if (agendaError || !insertData) {
    console.error('Error creating agenda:', agendaError)
    throw new Error(agendaError?.message || 'Failed to create')
  }

  // Insert assigned tecnicos
  if (assignedTecnicos.length > 0) {
    const relationships = assignedTecnicos.map(userId => ({
      agenda_id: insertData.agenda_id,
      usuario_id: userId
    }))

    const { error: relError } = await supabase.from('agenda_tecnico').insert(relationships)
    if (relError) console.error('Error linking tecnicos to agenda:', relError)
  }

  revalidatePath('/')
  revalidatePath('/agendas')
  redirect('/agendas')
}

export async function updateAgenda(agendaId: string, formData: FormData) {
  const assignedTecnicos = formData.getAll('assigned_tecnicos') as string[]

  const updatedAgenda = {
    instalacion_id: formData.get('instalacion_id'),
    fecha_visita: formData.get('fecha_visita')?.toString(),
    tipo_servicio: formData.get('tipo_servicio')?.toString(),
    descripcion: formData.get('descripcion')?.toString() || null,
    estatus: formData.get('estatus')?.toString()
  }

  const { error: agendaError } = await supabase
    .from('agendas')
    .update(updatedAgenda)
    .eq('agenda_id', agendaId)

  if (agendaError) {
    console.error('Error updating agenda:', agendaError)
    throw new Error(agendaError.message)
  }

  // Delete all bindings
  await supabase.from('agenda_tecnico').delete().eq('agenda_id', agendaId)

  // Re-insert exact matching bindings
  if (assignedTecnicos.length > 0) {
    const relationships = assignedTecnicos.map(userId => ({
      agenda_id: agendaId,
      usuario_id: userId
    }))

    const { error: relError } = await supabase.from('agenda_tecnico').insert(relationships)
    if (relError) console.error('Error linking tecnicos on update:', relError)
  }

  revalidatePath('/')
  revalidatePath('/agendas')
  redirect('/agendas')
}

export async function deleteAgenda(agendaId: string) {
  // Hard delete is okay for agendas or we can just cancel it
  const { error } = await supabase.from('agendas').delete().eq('agenda_id', agendaId)
  if (error) {
    console.error(error)
  }
  revalidatePath('/')
  revalidatePath('/agendas')
  redirect('/agendas')
}
