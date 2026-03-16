import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClickableRow } from '@/components/ui/clickable-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { InstalacionesFilter } from '@/components/instalaciones-filter'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteInstalacion } from './actions'

export const revalidate = 0

export default async function InstalacionesPage({ searchParams }: { searchParams: Promise<{ cliente?: string, sede?: string }> }) {
  const resolvedSearchParams = await searchParams
  const { cliente, sede } = resolvedSearchParams || {}

  let query = supabase
    .from('instalaciones')
    .select(`
      *,
      sedes!inner(nombre_sede, nit_id, clientes!inner(nombre_empresa), sede_usuarios(usuarios(nombre_completo))),
      estados_crud!inner(estado_crud)
    `)
    .eq('estados_crud.estado_crud', 'Activo')

  if (sede) {
    query = query.eq('sede_id', sede)
  } else if (cliente) {
    query = query.eq('sedes.nit_id', cliente)
  }

  const { data: instalaciones } = await query.order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instalaciones (Tanques)</h2>
          <p className="text-muted-foreground mt-1">Gestión de tanques instalados por sede y cliente.</p>
        </div>
        <Button asChild>
          <Link href="/instalaciones/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nueva Instalación
          </Link>
        </Button>
      </div>

      <InstalacionesFilter />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente y Sede</TableHead>
                <TableHead>Tipo de Tanque</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado Físico</TableHead>
                <TableHead>Usuario asignado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instalaciones?.map((inst) => (
                <ClickableRow key={inst.instalacion_id} href={`?view=instalaciones&id=${inst.instalacion_id}`}>
                  <TableCell className="font-medium">{inst.codigo}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{(inst as any).sedes?.clientes?.nombre_empresa}</span>
                      <span className="text-xs text-muted-foreground">{(inst as any).sedes?.nombre_sede}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {inst.tipo_tanque}
                    <div className="text-xs text-muted-foreground">{inst.tipo_agua}</div>
                  </TableCell>
                  <TableCell>{inst.capacidad} {inst.unidad_medida}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {inst.estado}
                    </span>
                  </TableCell>
                  <TableCell>{(inst as any)?.sedes?.sede_usuarios?.[0]?.usuarios?.nombre_completo || 'Sin asignar'}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/instalaciones/${inst.instalacion_id}`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteInstalacion(inst.instalacion_id)
                    }} className="inline-block">
                      <Button variant="ghost" size="icon" type="submit" title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </form>
                  </TableCell>
                </ClickableRow>
              ))}
              {(!instalaciones || instalaciones.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron instalaciones activas.
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
