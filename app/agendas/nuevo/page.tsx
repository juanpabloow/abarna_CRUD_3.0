import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAgenda } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function NuevaAgendaPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  // If navigated from calendar slot click, it brings a date via query params.
  const resolvedSearchParams = await searchParams
  const defaultDate = resolvedSearchParams?.date 
    ? `${resolvedSearchParams.date}T08:00` // default to 8 AM
    : ''

  const [
    { data: instalaciones },
    { data: tecnicos }
  ] = await Promise.all([
    supabase.from('instalaciones').select('instalacion_id, codigo, sedes!inner(nombre_sede, clientes!inner(nombre_empresa)), estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('usuarios').select('usuario_id, nombre_completo, email, estados_crud!inner(estado_crud)').eq('rol', 'tecnico').eq('estados_crud.estado_crud', 'Activo')
  ])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agendas"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agendar Visita</h2>
          <p className="text-muted-foreground mt-1">Programar mantenimiento, inspección o instalación.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createAgenda} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Información del Evento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="instalacion_id">Instalación (Cliente - Sede - Tanque) <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="instalacion_id" id="instalacion_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione la instalación...</option>
                    {instalaciones?.map(inst => (
                      <option key={inst.instalacion_id} value={inst.instalacion_id}>
                        {(inst as any).sedes?.clientes?.nombre_empresa} - {(inst as any).sedes?.nombre_sede} ({inst.codigo})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="fecha_visita">Fecha / Hora de Visita <span className="text-red-500">*</span></Label>
                  <Input id="fecha_visita" name="fecha_visita" type="datetime-local" required defaultValue={defaultDate} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_servicio">Tipo de Servicio <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="tipo_servicio" id="tipo_servicio" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="Lavado preventivo">Lavado preventivo</option>
                    <option value="Inspección técnica">Inspección técnica</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Instalación nueva">Instalación nueva</option>
                    <option value="Muestreo de Agua">Muestreo de Agua</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estatus">Estatus de la Visita <span className="text-red-500">*</span></Label>
                  <select name="estatus" id="estatus" required defaultValue="programada" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="programada">Programada</option>
                    <option value="en_curso">En Curso</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción o Notas</Label>
                <textarea 
                  name="descripcion" 
                  id="descripcion" 
                  rows={3} 
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Detalles adicionales sobre la visita..."
                ></textarea>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b pb-2">Asignación de Técnicos</h3>
              <p className="text-sm text-muted-foreground">Seleccione los técnicos operativos que realizarán esta visita.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border rounded-md bg-slate-50">
                {tecnicos?.map(tecnico => (
                  <label key={tecnico.usuario_id} className="flex items-center space-x-3 bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" name="assigned_tecnicos" value={tecnico.usuario_id} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{tecnico.nombre_completo}</span>
                    </div>
                  </label>
                ))}
                {(!tecnicos || tecnicos.length === 0) && (
                  <p className="text-sm text-muted-foreground col-span-2">No hay técnicos creados en el sistema.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/agendas">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar Agenda</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
