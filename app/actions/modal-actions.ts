'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── USUARIOS ────────────────────────────────────────────────────────────────

export async function updateUsuarioModal(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('usuarios').update({
    nombre_completo: formData.get('nombre_completo'),
    cedula:   formData.get('cedula')?.toString()   || null,
    email:    formData.get('email')?.toString()    || null,
    telefono: formData.get('telefono')?.toString() || null,
    rol:      formData.get('rol'),
  }).eq('usuario_id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/usuarios')
}

export async function deleteUsuarioModal(id: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('usuarios').update({ estado_crud_id: e.estado_crud_id }).eq('usuario_id', id)
    revalidatePath('/usuarios')
  }
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export async function updateClienteModal(nitId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: est } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Activo').single()
  const assignedUsers = formData.getAll('assigned_users') as string[]

  const { error } = await supabase.from('clientes').update({
    nombre_empresa:   formData.get('nombre_empresa')?.toString(),
    tipo_persona_id:  formData.get('tipo_persona_id'),
    fuente_id:        formData.get('fuente_id'),
    telefono_empresa: formData.get('telefono_empresa')?.toString() || null,
    email_empresa:    formData.get('email_empresa')?.toString()    || null,
  }).eq('nit_id', nitId)
  if (error) throw new Error(error.message)

  await supabase.from('cliente_usuarios').delete().eq('nit_id', nitId)
  if (assignedUsers.length > 0) {
    await supabase.from('cliente_usuarios').insert(
      assignedUsers.map(uid => ({
        nit_id: nitId, usuario_id: uid,
        tipo_relacion: 'contacto_principal', es_principal: true,
        estado_crud_id: est?.estado_crud_id
      }))
    )
  }
  revalidatePath('/clientes')
}

export async function deleteClienteModal(nitId: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('clientes').update({ estado_crud_id: e.estado_crud_id }).eq('nit_id', nitId)
    revalidatePath('/clientes')
  }
}

// ─── SEDES ───────────────────────────────────────────────────────────────────

export async function updateSedeModal(sedeId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: est } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Activo').single()
  const assignedUsers = formData.getAll('assigned_users') as string[]

  const { error } = await supabase.from('sedes').update({
    nit_id:      formData.get('nit_id'),
    nombre_sede: formData.get('nombre_sede')?.toString(),
    direccion:   formData.get('direccion')?.toString() || null,
    ciudad_id:   formData.get('ciudad_id'),
  }).eq('sede_id', sedeId)
  if (error) throw new Error(error.message)

  await supabase.from('sede_usuarios').delete().eq('sede_id', sedeId)
  if (assignedUsers.length > 0) {
    await supabase.from('sede_usuarios').insert(
      assignedUsers.map(uid => ({
        sede_id: sedeId, usuario_id: uid,
        tipo_relacion: 'encargado_sede', es_principal: false,
        estado_crud_id: est?.estado_crud_id
      }))
    )
  }
  revalidatePath('/sedes')
}

export async function deleteSedeModal(sedeId: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('sedes').update({ estado_crud_id: e.estado_crud_id }).eq('sede_id', sedeId)
    revalidatePath('/sedes')
  }
}

// ─── INSTALACIONES ───────────────────────────────────────────────────────────

export async function updateInstalacionModal(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('instalaciones').update({
    sede_id:                  formData.get('sede_id'),
    codigo:                   formData.get('codigo')?.toString(),
    tipo_tanque:              formData.get('tipo_tanque')?.toString(),
    tipo_agua:                formData.get('tipo_agua')?.toString(),
    capacidad:                Number(formData.get('capacidad')) || 0,
    unidad_medida:            formData.get('unidad_medida')?.toString(),
    fecha_instalacion:        formData.get('fecha_instalacion')?.toString() || null,
    frecuencia_mantenimiento: Number(formData.get('frecuencia_mantenimiento')) || 180,
    estado:                   formData.get('estado')?.toString(),
  }).eq('instalacion_id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/instalaciones')
}

export async function deleteInstalacionModal(id: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('instalaciones').update({ estado_crud_id: e.estado_crud_id }).eq('instalacion_id', id)
    revalidatePath('/instalaciones')
  }
}

// ─── AGENDAS ─────────────────────────────────────────────────────────────────

export async function updateAgendaModal(agendaId: string, formData: FormData) {
  const supabase = await createClient()
  const assignedTecnicos = formData.getAll('assigned_tecnicos') as string[]

  const { error } = await supabase.from('agendas').update({
    instalacion_id: formData.get('instalacion_id'),
    fecha_visita:   formData.get('fecha_visita')?.toString(),
    tipo_servicio:  formData.get('tipo_servicio')?.toString(),
    descripcion:    formData.get('descripcion')?.toString() || null,
    estatus:        formData.get('estatus')?.toString(),
  }).eq('agenda_id', agendaId)
  if (error) throw new Error(error.message)

  await supabase.from('agenda_tecnico').delete().eq('agenda_id', agendaId)
  if (assignedTecnicos.length > 0) {
    await supabase.from('agenda_tecnico').insert(
      assignedTecnicos.map(uid => ({ agenda_id: agendaId, usuario_id: uid }))
    )
  }
  revalidatePath('/agendas')
}

export async function deleteAgendaModal(agendaId: string) {
  const supabase = await createClient()
  await supabase.from('agendas').delete().eq('agenda_id', agendaId)
  revalidatePath('/agendas')
}

// ─── AGENDA RESCHEDULE (drag-and-drop) ───────────────────────────────────────

// Accepts a pre-formatted naive datetime string (yyyy-MM-dd'T'HH:mm) from the
// client so the server never converts timezone — consistent with datetime-local inputs.
export async function rescheduleAgenda(agendaId: string, newFechaVisita: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('agendas')
    .update({ fecha_visita: newFechaVisita })
    .eq('agenda_id', agendaId)
  if (error) throw new Error(error.message)
  revalidatePath('/agendas')
}

// ─── FUENTES ─────────────────────────────────────────────────────────────────

export async function updateFuenteModal(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('fuentes')
    .update({ fuente: formData.get('fuente')?.toString() })
    .eq('fuente_id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/fuentes')
}

export async function deleteFuenteModal(id: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('fuentes').update({ estado_crud_id: e.estado_crud_id }).eq('fuente_id', id)
    revalidatePath('/fuentes')
  }
}

// ─── CIUDADES ────────────────────────────────────────────────────────────────

export async function updateCiudadModal(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('ciudades')
    .update({ ciudad: formData.get('ciudad')?.toString() })
    .eq('ciudad_id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/ciudades')
}

export async function deleteCiudadModal(id: string) {
  const supabase = await createClient()
  const { data: e } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (e) {
    await supabase.from('ciudades').update({ estado_crud_id: e.estado_crud_id }).eq('ciudad_id', id)
    revalidatePath('/ciudades')
  }
}
