import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createInstalacion } from '../actions'
import { InstalacionCascade } from '@/components/ui/cascade-selects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 0

export default async function NuevaInstalacionPage() {

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/instalaciones"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Crear Nueva Instalación</h2>
          <p className="text-muted-foreground mt-1">Registra un nuevo tanque o sistema en una sede.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createInstalacion} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Ubicación y Código</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <InstalacionCascade />
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código Interno</Label>
                  <Input id="codigo" name="codigo" placeholder="Ej. T-1234 (Generado autom. si se omite)" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium border-b pb-2">Especificaciones Técnicas</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo_tanque">Tipo de Tanque <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="tipo_tanque" id="tipo_tanque" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione...</option>
                    <option value="Tanque Aéreo">Tanque Aéreo</option>
                    <option value="Tanque Subterráneo">Tanque Subterráneo</option>
                    <option value="Tanque Plástico">Tanque Plástico</option>
                    <option value="Reserva Contra Incendios">Reserva Contra Incendios</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_agua">Tipo de Agua <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="tipo_agua" id="tipo_agua" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="" disabled>Seleccione...</option>
                    <option value="Potable">Potable</option>
                    <option value="Lluvia">No Potable / Lluvia</option>
                    <option value="Residual">Residual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad <span className="text-red-500">*</span></Label>
                  <Input id="capacidad" name="capacidad" type="number" required placeholder="Ej. 10000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                  <select defaultValue="" name="unidad_medida" id="unidad_medida" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="Litros">Litros</option>
                    <option value="Galones">Galones</option>
                    <option value="Metros Cúbicos">Metros Cúbicos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium border-b pb-2">Mantenimiento</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_instalacion">Fecha Instalación</Label>
                  <Input id="fecha_instalacion" name="fecha_instalacion" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frecuencia_mantenimiento">Frecuencia (Días) <span className="text-red-500">*</span></Label>
                  <Input id="frecuencia_mantenimiento" name="frecuencia_mantenimiento" type="number" required defaultValue={180} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Físico <span className="text-red-500">*</span></Label>
                  <select defaultValue="" name="estado" id="estado" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="Operativo">Operativo</option>
                    <option value="En Mantenimiento">En Mantenimiento</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2 border-t">
              <Button variant="outline" type="button" asChild>
                <Link href="/instalaciones">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar Instalación</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
