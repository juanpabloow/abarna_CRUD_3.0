import { supabase } from '@/lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteCliente } from './actions'

export const revalidate = 0

export default async function ClientesPage() {
  const { data: clientes } = await supabase
    .from('clientes')
    .select(`
      *,
      tipo_personas!inner(tipo_persona),
      fuentes!inner(fuente),
      estados_crud!inner(estado_crud)
    `)
    .eq('estados_crud.estado_crud', 'Activo')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground mt-1">Gestión de empresas y personas clientes.</p>
        </div>
        <Button asChild>
          <Link href="/clientes/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIT / Documento</TableHead>
                <TableHead>Nombre / Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes?.map((cliente) => (
                <TableRow key={cliente.nit_id}>
                  <TableCell className="font-medium">{cliente.nit_id}</TableCell>
                  <TableCell>{cliente.nombre_empresa}</TableCell>
                  <TableCell>{(cliente as any).tipo_personas?.tipo_persona}</TableCell>
                  <TableCell>{(cliente as any).fuentes?.fuente}</TableCell>
                  <TableCell>{cliente.telefono_empresa || '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/clientes/${cliente.nit_id}`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteCliente(cliente.nit_id)
                    }} className="inline-block">
                      <Button variant="ghost" size="icon" type="submit" title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {(!clientes || clientes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron clientes activos.
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
