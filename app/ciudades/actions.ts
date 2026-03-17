'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createCiudad(formData: FormData) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const newRecord = {
    ciudad: formData.get('ciudad')?.toString(),
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { error } = await supabase.from('ciudades').insert([newRecord])
  if (error) throw new Error(error.message)

  revalidatePath('/ciudades')
  redirect('/ciudades')
}

export async function updateCiudad(id: string, formData: FormData) {
  const supabase = await createClient()
  const updatedRecord = {
    ciudad: formData.get('ciudad')?.toString(),
  }

  const { error } = await supabase.from('ciudades').update(updatedRecord).eq('ciudad_id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/ciudades')
  redirect('/ciudades')
}

export async function deleteCiudad(id: string) {
  const supabase = await createClient()
  const { data: estadoData } = await supabase.from('estados_crud').select('estado_crud_id').eq('estado_crud', 'Eliminado').single()
  if (estadoData) {
    await supabase.from('ciudades').update({ estado_crud_id: estadoData.estado_crud_id }).eq('ciudad_id', id)
    revalidatePath('/ciudades')
  }
}
