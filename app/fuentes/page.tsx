import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteFuente } from './actions'

export const revalidate = 0

export default async function FuentesPage() {
  const { data: records } = await supabase
    .from('fuentes')
    .select('*, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
    .order('fuente', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fuentes</h2>
          <p className="text-muted-foreground mt-1">Orígenes de contacto o referidos para clientes.</p>
        </div>
        <Button asChild>
          <Link href="/fuentes/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nueva Fuente
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fuente</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((record) => (
                <TableRow key={record.fuente_id}>
                  <TableCell className="font-medium">{record.fuente}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/fuentes/${record.fuente_id}`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteFuente(record.fuente_id)
                    }} className="inline-block">
                      <Button variant="ghost" size="icon" type="submit" title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {(!records || records.length === 0) && (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    No hay fuentes registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
