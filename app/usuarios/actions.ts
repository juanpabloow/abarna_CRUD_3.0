'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createUsuario(formData: FormData) {
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const newUsuario = {
    nombre_completo: formData.get('nombre_completo'),
    cedula: formData.get('cedula')?.toString() || null,
    email: formData.get('email')?.toString() || null,
    telefono: formData.get('telefono')?.toString() || null,
    rol: formData.get('rol'),
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { error } = await supabase.from('usuarios').insert([newUsuario])
  if (error) {
    console.error('Error creating user:', error)
    throw new Error(error.message)
  }

  revalidatePath('/usuarios')
  redirect('/usuarios')
}

export async function updateUsuario(id: string, formData: FormData): Promise<void> {
  const updatedUsuario = {
    nombre_completo: formData.get('nombre_completo'),
    cedula: formData.get('cedula')?.toString() || null,
    email: formData.get('email')?.toString() || null,
    telefono: formData.get('telefono')?.toString() || null,
    rol: formData.get('rol'),
  }

  const { error } = await supabase
    .from('usuarios')
    .update(updatedUsuario)
    .eq('usuario_id', id)

  if (error) {
    console.error('Error updating user:', error)
    throw new Error(error.message)
  }

  revalidatePath('/usuarios')
  redirect('/usuarios')
}

export async function deleteUsuario(id: string) {
  // Soft Delete: change estado to Eliminado
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Eliminado')
    .single()

  if (estadoData) {
    await supabase
      .from('usuarios')
      .update({ estado_crud_id: estadoData.estado_crud_id })
      .eq('usuario_id', id)
      
    revalidatePath('/usuarios')
  }
}
