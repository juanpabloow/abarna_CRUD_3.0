'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createInstalacion(formData: FormData) {
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Activo')
    .single()

  const newInstalacion = {
    sede_id: formData.get('sede_id'),
    codigo: formData.get('codigo')?.toString() || `T-${Math.floor(Math.random() * 10000)}`,
    tipo_tanque: formData.get('tipo_tanque')?.toString(),
    tipo_agua: formData.get('tipo_agua')?.toString(),
    capacidad: Number(formData.get('capacidad')) || 0,
    unidad_medida: formData.get('unidad_medida')?.toString() || 'Litros',
    fecha_instalacion: formData.get('fecha_instalacion')?.toString() || new Date().toISOString(),
    frecuencia_mantenimiento: Number(formData.get('frecuencia_mantenimiento')) || 180,
    estado: formData.get('estado')?.toString() || 'Operativo',
    estado_crud_id: estadoData?.estado_crud_id
  }

  const { error } = await supabase.from('instalaciones').insert([newInstalacion])

  if (error) {
    console.error('Error creating instalacion:', error)
    throw new Error(error.message)
  }

  revalidatePath('/instalaciones')
  redirect('/instalaciones')
}

export async function updateInstalacion(id: string, formData: FormData) {
  const updatedInstalacion = {
    sede_id: formData.get('sede_id'),
    codigo: formData.get('codigo')?.toString(),
    tipo_tanque: formData.get('tipo_tanque')?.toString(),
    tipo_agua: formData.get('tipo_agua')?.toString(),
    capacidad: Number(formData.get('capacidad')) || 0,
    unidad_medida: formData.get('unidad_medida')?.toString(),
    fecha_instalacion: formData.get('fecha_instalacion')?.toString(),
    frecuencia_mantenimiento: Number(formData.get('frecuencia_mantenimiento')) || 180,
    estado: formData.get('estado')?.toString()
  }

  const { error } = await supabase
    .from('instalaciones')
    .update(updatedInstalacion)
    .eq('instalacion_id', id)

  if (error) {
    console.error('Error updating instalacion:', error)
    throw new Error(error.message)
  }

  revalidatePath('/instalaciones')
  redirect('/instalaciones')
}

export async function deleteInstalacion(id: string) {
  const { data: estadoData } = await supabase
    .from('estados_crud')
    .select('estado_crud_id')
    .eq('estado_crud', 'Eliminado')
    .single()

  if (estadoData) {
    await supabase.from('instalaciones').update({ estado_crud_id: estadoData.estado_crud_id }).eq('instalacion_id', id)
    revalidatePath('/instalaciones')
  }
}
