import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateSede } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function EditarSedePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [
    { data: sede },
    { data: clientes },
    { data: ciudades },
    { data: contactos },
    { data: assignedData }
  ] = await Promise.all([
    supabase.from('sedes').select('*').eq('sede_id', id).single(),
    supabase.from('clientes').select('nit_id, nombre_empresa, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('ciudades').select('ciudad_id, ciudad, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('usuarios').select('usuario_id, nombre_completo, email, estados_crud!inner(estado_crud)').eq('rol', 'cliente').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('sede_usuarios').select('usuario_id').eq('sede_id', id)
  ])

  if (!sede) {
    notFound()
  }

  const assignedUsersSet = new Set(assignedData?.map(d => d.usuario_id) || [])
  const updateAction = updateSede.bind(null, id)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sedes"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Sede</h2>
          <p className="text-muted-foreground mt-1">Actualiza los datos de la ubicación y sus encargados.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={updateAction} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Información de la Sede</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nit_id">Empresa (Cliente) <span className="text-red-500">*</span></Label>
                  <select name="nit_id" id="nit_id" required defaultValue={sede.nit_id} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {clientes?.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa} ({c.nit_id})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre_sede">Nombre de la Sede <span className="text-red-500">*</span></Label>
                  <Input id="nombre_sede" name="nombre_sede" required defaultValue={sede.nombre_sede} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad_id">Ciudad <span className="text-red-500">*</span></Label>
                  <select name="ciudad_id" id="ciudad_id" required defaultValue={sede.ciudad_id} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {ciudades?.map(c => <option key={c.ciudad_id} value={c.ciudad_id}>{c.ciudad}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección Física</Label>
                  <Input id="direccion" name="direccion" defaultValue={sede.direccion || ''} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b pb-2">Encargados de Sede (Contactos)</h3>
              <p className="text-sm text-muted-foreground">Seleccione los usuarios que estarán a cargo de esta sede.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border rounded-md bg-slate-50">
                {contactos?.map(contacto => (
                  <label key={contacto.usuario_id} className="flex items-center space-x-3 bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:bg-slate-50">
                    <input 
                      type="checkbox" 
                      name="assigned_users" 
                      value={contacto.usuario_id} 
                      defaultChecked={assignedUsersSet.has(contacto.usuario_id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{contacto.nombre_completo}</span>
                      <span className="text-xs text-muted-foreground">{contacto.email || 'Sin correo'}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/sedes">Cancelar</Link>
              </Button>
              <Button type="submit">Actualizar Sede</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
