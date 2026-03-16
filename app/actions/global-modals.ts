'use server'

import { supabase } from '@/lib/supabase'

export async function getEntityDetail(view: string, id: string) {
  switch (view) {
    case 'clientes': {
      const { data } = await supabase
        .from('clientes')
        .select(`
          *,
          tipo_personas(tipo_persona),
          fuentes(fuente),
          cliente_usuarios(
            usuarios(usuario_id, nombre_completo, email, telefono)
          ),
          sedes(
            sede_id, nombre_sede, direccion,
            ciudades(ciudad)
          )
        `)
        .eq('nit_id', id)
        .single()
      return data
    }
    case 'sedes': {
      const { data } = await supabase
        .from('sedes')
        .select(`
          *,
          ciudades(ciudad),
          clientes(nit_id, nombre_empresa),
          instalaciones(
            instalacion_id,
            codigo,
            capacidad,
            unidad_medida,
            tipo_tanque
          ),
          sede_usuarios(
            usuarios(usuario_id, nombre_completo, email, telefono)
          )
        `)
        .eq('sede_id', id)
        .single()
      return data
    }
    case 'instalaciones': {
      const { data } = await supabase
        .from('instalaciones')
        .select(`
          *,
          sedes(
            sede_id, nombre_sede,
            clientes(nit_id, nombre_empresa)
          ),
          agendas(
            agenda_id, fecha_visita, estatus
          )
        `)
        .eq('instalacion_id', id)
        .single()
      return data
    }
    case 'usuarios': {
      const { data } = await supabase
        .from('usuarios')
        .select(`
          *,
          cliente_usuarios(clientes(nit_id, nombre_empresa))
        `)
        .eq('usuario_id', id)
        .single()
      return data
    }
    case 'agendas': {
      const { data } = await supabase
        .from('agendas')
        .select(`
          *,
          instalaciones(
            instalacion_id, codigo,
            sedes(sede_id, nombre_sede)
          ),
          agenda_tecnico(
            usuarios(usuario_id, nombre_completo)
          )
        `)
        .eq('agenda_id', id)
        .single()
      return data
    }
    default:
      return null
  }
}
