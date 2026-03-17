import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateFuente } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function EditarFuentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: record } = await supabase.from('fuentes').select('*').eq('fuente_id', id).single()

  if (!record) {
    notFound()
  }

  const updateAction = updateFuente.bind(null, id)

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fuentes"><ArrowLeft className="h-5 w-5"/></Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Fuente</h2>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={updateAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fuente">Nombre de la Fuente <span className="text-red-500">*</span></Label>
              <Input id="fuente" name="fuente" required defaultValue={record.fuente} />
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <Button variant="outline" type="button" asChild>
                <Link href="/fuentes">Cancelar</Link>
              </Button>
              <Button type="submit">Actualizar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
