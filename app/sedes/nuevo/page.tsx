import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSede } from '../actions'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function NuevaSedePage() {
  const supabase = await createClient()
  const [
    { data: clientes },
    { data: ciudades }
  ] = await Promise.all([
    supabase.from('clientes').select('nit_id, nombre_empresa, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo'),
    supabase.from('ciudades').select('ciudad_id, ciudad, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo')
  ])

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/sedes"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crear Nueva Sede</h2>
          <p className="text-muted-foreground mt-1">Registra una nueva ubicación o sucursal para un cliente.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createSede} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Información de la Sede</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nit_id">Empresa (Cliente) <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="nit_id" id="nit_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione la empresa...</option>
                    {clientes?.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa} ({c.nit_id})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre_sede">Nombre de la Sede <span className="text-red-500">*</span></Label>
                  <Input id="nombre_sede" name="nombre_sede" required placeholder="Ej. Edificio Principal, Sucursal Norte..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad_id">Ciudad <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="ciudad_id" id="ciudad_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione la ciudad...</option>
                    {ciudades?.map(c => <option key={c.ciudad_id} value={c.ciudad_id}>{c.ciudad}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección Física</Label>
                  <Input id="direccion" name="direccion" placeholder="Ej. Carrera 15 # 100-20" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b pb-2">Encargados de Sede (Contactos)</h3>
              <p className="text-sm text-muted-foreground">Seleccione los usuarios que estarán a cargo de esta sede en específico.</p>
              
              <div className="pt-2">
                <MultiUserSelect roleFilter="cliente" fieldName="assigned_users" />
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/sedes">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar Sede</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
