'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createCliente(formData: FormData) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const assignedUsers = formData.getAll('assigned_users') as string[]

  const newCliente = {
    nit_id: formData.get('nit_id')?.toString(),
    nombre_empresa: formData.get('nombre_empresa')?.toString(),
    tipo_persona_id: formData.get('tipo_persona_id'),
    fuente_id: formData.get('fuente_id'),
    telefono_empresa: formData.get('telefono_empresa')?.toString() || null,
    email_empresa: formData.get('email_empresa')?.toString() || null,
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { error: clienteError } = await supabase.from('clientes').insert([newCliente])
  if (clienteError) {
    console.error('Error creating cliente:', clienteError)
    throw new Error(clienteError.message)
  }

  if (assignedUsers.length > 0) {
    const relationships = assignedUsers.map(userId => ({
      nit_id: newCliente.nit_id,
      usuario_id: userId,
      tipo_relacion: 'contacto_principal',
      es_principal: true,
      estado_crud_id: estadoData?.estado_crud_id
    }))

    const { error: relError } = await supabase.from('cliente_usuarios').insert(relationships)
    if (relError) console.error('Error linking users:', relError)
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function updateCliente(nitId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const assignedUsers = formData.getAll('assigned_users') as string[]

  const updatedCliente = {
    nombre_empresa: formData.get('nombre_empresa')?.toString(),
    tipo_persona_id: formData.get('tipo_persona_id'),
    fuente_id: formData.get('fuente_id'),
    telefono_empresa: formData.get('telefono_empresa')?.toString() || null,
    email_empresa: formData.get('email_empresa')?.toString() || null,
  }

  const { error: clienteError } = await supabase
    .from('clientes')
    .update(updatedCliente)
    .eq('nit_id', nitId)

  if (clienteError) {
    console.error('Error updating cliente:', clienteError)
    throw new Error(clienteError.message)
  }

  await supabase.from('cliente_usuarios').delete().eq('nit_id', nitId)

  if (assignedUsers.length > 0) {
    const relationships = assignedUsers.map(userId => ({
      nit_id: nitId,
      usuario_id: userId,
      tipo_relacion: 'contacto_principal',
      es_principal: true,
      estado_crud_id: estadoData?.estado_crud_id
    }))

    const { error: relError } = await supabase.from('cliente_usuarios').insert(relationships)
    if (relError) console.error('Error linking users on update:', relError)
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function deleteCliente(nitId: string) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Eliminado')
    .single()

  if (estadoData) {
    await supabase.from('clientes').update({ estado_crud_id: estadoData.estado_crud_id }).eq('nit_id', nitId)
    revalidatePath('/clientes')
  }
}
