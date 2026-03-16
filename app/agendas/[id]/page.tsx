import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAgenda, deleteAgenda } from '../actions'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import { AgendaCascade } from '@/components/ui/cascade-selects'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function EditarAgendaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [
    { data: agenda },
    { data: assignedData }
  ] = await Promise.all([
    supabase.from('agendas').select('*, instalaciones(sede_id, sedes(nit_id))').eq('agenda_id', id).single(),
    supabase.from('agenda_tecnico').select('usuarios(usuario_id, nombre_completo, email)').eq('agenda_id', id)
  ])

  if (!agenda) {
    notFound()
  }

  const initialSelected = (assignedData || []).map((d: any) => d.usuarios).filter(Boolean)
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
              
              <div className="border border-input rounded-md p-4 bg-slate-50 mb-6">
                <AgendaCascade 
                  defaultInstalacionId={agenda.instalacion_id} 
                  defaultSedeId={(agenda as any).instalaciones?.sede_id}
                  defaultClienteId={(agenda as any).instalaciones?.sedes?.nit_id}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              
              <div className="pt-2">
                <MultiUserSelect roleFilter="tecnico" fieldName="assigned_tecnicos" initialSelected={initialSelected} />
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
