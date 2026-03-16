import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteSede } from './actions'

export const revalidate = 0

export default async function SedesPage() {
  const { data: sedes } = await supabase
    .from('sedes')
    .select(`
      *,
      ciudades!inner(ciudad),
      clientes!inner(nombre_empresa),
      estados_crud!inner(estado_crud)
    `)
    .eq('estados_crud.estado_crud', 'Activo')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sedes</h2>
          <p className="text-muted-foreground mt-1">Gestión de ubicaciones e instalaciones de clientes.</p>
        </div>
        <Button asChild>
          <Link href="/sedes/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nueva Sede
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableHead>Empresa (Cliente)</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sedes?.map((sede) => (
                <TableRow key={sede.sede_id}>
                  <TableCell className="font-medium">{sede.nombre_sede}</TableCell>
                  <TableCell>{(sede as any).clientes?.nombre_empresa}</TableCell>
                  <TableCell>{(sede as any).ciudades?.ciudad}</TableCell>
                  <TableCell>{sede.direccion || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/sedes/${sede.sede_id}`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteSede(sede.sede_id)
                    }} className="inline-block">
                      <Button variant="ghost" size="icon" type="submit" title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {(!sedes || sedes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No se encontraron sedes activas.
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
