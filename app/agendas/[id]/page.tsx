import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAgenda, deleteAgenda } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function EditarAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [
    { data: agenda },
    { data: instalaciones },
    { data: tecnicos },
    { data: assignedData }
  ] = await Promise.all([
    supabase.from('agendas').select('*').eq('agenda_id', id).single(),
    supabase.from('instalaciones').select('instalacion_id, codigo, sedes!inner(nombre_sede, clientes!inner(nombre_empresa)), estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('usuarios').select('usuario_id, nombre_completo, email, estados_crud!inner(estado_crud)').eq('rol', 'tecnico').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('agenda_tecnico').select('usuario_id').eq('agenda_id', id)
  ])

  if (!agenda) {
    notFound()
  }

  const assignedUsersSet = new Set(assignedData?.map(d => d.usuario_id) || [])
  const updateAction = updateAgenda.bind(null, id)

  // Format date for datetime-local input safely
  const formattedDate = agenda.fecha_visita
    ? new Date(agenda.fecha_visita).toISOString().slice(0, 16)
    : ''

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agendas"><ArrowLeft className="h-5 w-5"/></Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Editar Visita Agendada</h2>
            <p className="text-muted-foreground mt-1">Actualiza los datos o reasigna técnicos.</p>
          </div>
        </div>
        <form action={async () => {
          'use server'
          await deleteAgenda(id)
        }}>
          <Button variant="destructive" size="sm" type="submit">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={updateAction} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Información del Evento</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="instalacion_id">Instalación (Cliente - Sede - Tanque) <span className="text-red-500">*</span></Label>
                  <select name="instalacion_id" id="instalacion_id" required defaultValue={agenda.instalacion_id} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {instalaciones?.map(inst => (
                      <option key={inst.instalacion_id} value={inst.instalacion_id}>
                        {(inst as any).sedes?.clientes?.nombre_empresa} - {(inst as any).sedes?.nombre_sede} ({inst.codigo})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="fecha_visita">Fecha / Hora de Visita <span className="text-red-500">*</span></Label>
                  <Input id="fecha_visita" name="fecha_visita" type="datetime-local" required defaultValue={formattedDate} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_servicio">Tipo de Servicio <span className="text-red-500">*</span></Label>
                  <select name="tipo_servicio" id="tipo_servicio" required defaultValue={agenda.tipo_servicio} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="Lavado preventivo">Lavado preventivo</option>
                    <option value="Inspección técnica">Inspección técnica</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Instalación nueva">Instalación nueva</option>
                    <option value="Muestreo de Agua">Muestreo de Agua</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estatus">Estatus de la Visita <span className="text-red-500">*</span></Label>
                  <select name="estatus" id="estatus" required defaultValue={agenda.estatus} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
                  defaultValue={agenda.descripcion || ''}
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
                    <input 
                      type="checkbox" 
                      name="assigned_tecnicos" 
                      value={tecnico.usuario_id} 
                      defaultChecked={assignedUsersSet.has(tecnico.usuario_id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{tecnico.nombre_completo}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/agendas">Cancelar</Link>
              </Button>
              <Button type="submit">Actualizar Agenda</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
