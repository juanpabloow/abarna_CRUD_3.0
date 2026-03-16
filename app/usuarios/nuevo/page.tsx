import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createUsuario } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NuevoUsuarioPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/usuarios"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crear Nuevo Usuario</h2>
          <p className="text-muted-foreground mt-1">Ingresa los datos del nuevo usuario en el sistema.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createUsuario} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo <span className="text-red-500">*</span></Label>
              <Input id="nombre_completo" name="nombre_completo" required placeholder="Ej. Juan Pérez" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input id="cedula" name="cedula" placeholder="Ej. 1000222333" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol">Rol del Usuario <span className="text-red-500">*</span></Label>
                <select defaultValue="" 
                  name="rol" 
                  id="rol" 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Seleccione un rol...</option>
                  <option value="admin">Administrador (Admin)</option>
                  <option value="cliente">Cliente (Contacto)</option>
                  <option value="tecnico">Técnico (Operario)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" placeholder="Ej. 3001234567" />
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/usuarios">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
