import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUsuario } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario_id', id)
    .single()

  if (!usuario) {
    notFound()
  }

  const updateAction = updateUsuario.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/usuarios"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Usuario</h2>
          <p className="text-muted-foreground mt-1">Modificar los datos del perfil de usuario.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={updateAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo <span className="text-red-500">*</span></Label>
              <Input id="nombre_completo" name="nombre_completo" required defaultValue={usuario.nombre_completo} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input id="cedula" name="cedula" defaultValue={usuario.cedula || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol del Usuario <span className="text-red-500">*</span></Label>
                <select 
                  name="rol" 
                  id="rol" 
                  required
                  defaultValue={usuario.rol}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Administrador (Admin)</option>
                  <option value="cliente">Cliente (Contacto)</option>
                  <option value="tecnico">Técnico (Operario)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" defaultValue={usuario.email || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" defaultValue={usuario.telefono || ''} />
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/usuarios">Cancelar</Link>
              </Button>
              <Button type="submit">Actualizar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
