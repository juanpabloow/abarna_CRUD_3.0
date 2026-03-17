import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClickableRow } from '@/components/ui/clickable-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const revalidate = 0

export default async function CiudadesPage() {
  const supabase = await createClient()
  const { data: records } = await supabase
    .from('ciudades')
    .select('*, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
    .order('ciudad', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ciudades</h2>
          <p className="text-muted-foreground mt-1">Gestión del diccionario de ciudades.</p>
        </div>
        <Button asChild>
          <Link href="/ciudades/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nueva Ciudad
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciudad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.map((record) => (
                <ClickableRow key={record.ciudad_id} href={`?edit=ciudades&id=${record.ciudad_id}`}>
                  <TableCell className="font-medium">{record.ciudad}</TableCell>
                </ClickableRow>
              ))}
              {(!records || records.length === 0) && (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground">
                    No hay ciudades registradas.
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
