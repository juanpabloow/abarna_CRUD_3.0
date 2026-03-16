'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createFuente(formData: FormData) {
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const newRecord = {
    fuente: formData.get('fuente')?.toString(),
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { error } = await supabase.from('fuentes').insert([newRecord])
  if (error) throw new Error(error.message)

  revalidatePath('/fuentes')
  redirect('/fuentes')
}

export async function updateFuente(id: string, formData: FormData) {
  const updatedRecord = {
    fuente: formData.get('fuente')?.toString(),
  }

  const { error } = await supabase.from('fuentes').update(updatedRecord).eq('fuente_id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/fuentes')
  redirect('/fuentes')
}

export async function deleteFuente(id: string) {
  const { data: estadoData } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (estadoData) {
    await supabase.from('fuentes').update({ estado_crud_id: estadoData.estado_crud_id }).eq('fuente_id', id)
    revalidatePath('/fuentes')
  }
}
