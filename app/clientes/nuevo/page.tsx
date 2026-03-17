import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCliente } from '../actions'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function NuevoClientePage() {
  const supabase = await createClient()
  const { data: tp } = await supabase.from('tipo_personas').select('tipo_persona_id, tipo_persona, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo')
  const { data: ft } = await supabase.from('fuentes').select('fuente_id, fuente, estados_crud!inner(estado_crud)').eq('estados_crud.estado_crud', 'Activo')

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clientes"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crear Nuevo Cliente</h2>
          <p className="text-muted-foreground mt-1">Registra una nueva empresa o cliente natural.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createCliente} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Información Principal</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nit_id">NIT / Documento <span className="text-red-500">*</span></Label>
                  <Input id="nit_id" name="nit_id" required placeholder="Ej. 900123456-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre_empresa">Nombre / Razón Social <span className="text-red-500">*</span></Label>
                  <Input id="nombre_empresa" name="nombre_empresa" required placeholder="Ej. Constructora ABC" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_persona_id">Tipo de Cliente <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="tipo_persona_id" id="tipo_persona_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione...</option>
                    {tp?.map(t => <option key={t.tipo_persona_id} value={t.tipo_persona_id}>{t.tipo_persona}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuente_id">Fuente (¿Cómo nos conoció?) <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="fuente_id" id="fuente_id" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione...</option>
                    {ft?.map(f => <option key={f.fuente_id} value={f.fuente_id}>{f.fuente}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email_empresa">Correo de Facturación / Principal</Label>
                  <Input id="email_empresa" name="email_empresa" type="email" placeholder="facturacion@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono_empresa">Teléfono Empresa</Label>
                  <Input id="telefono_empresa" name="telefono_empresa" type="tel" placeholder="Ej. 6012345678" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium border-b pb-2">Usuarios de Contacto Asociados</h3>
              <p className="text-sm text-muted-foreground">Seleccione los usuarios que estarán vinculados a este cliente (ej. administrador, encargado, representante legal).</p>
              
              <div className="pt-2">
                <MultiUserSelect roleFilter="cliente" fieldName="assigned_users" />
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/clientes">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar Cliente</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
