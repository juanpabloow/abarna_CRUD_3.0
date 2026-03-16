import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFuente } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NuevaFuentePage() {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fuentes"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Añadir Fuente</h2>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={createFuente} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fuente">Nombre de la Fuente <span className="text-red-500">*</span></Label>
              <Input id="fuente" name="fuente" required />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/fuentes">Cancelar</Link>
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
