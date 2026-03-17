import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClickableRow } from '@/components/ui/clickable-row'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { deleteUsuario } from './actions'

const rolStyles: Record<string, string> = {
  admin:    'bg-green-100 text-green-800',
  cliente:  'bg-yellow-100 text-yellow-800',
  tecnico:  'bg-blue-100 text-blue-800',
}

function RoleBadge({ rol }: { rol: string }) {
  const colorClass = rolStyles[rol?.toLowerCase()] ?? 'bg-slate-100 text-slate-800'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colorClass}`}>
      {rol}
    </span>
  )
}

export const revalidate = 0

export default async function UsuariosPage() {
  const supabase = await createClient()
  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('*, estados_crud!inner(estado_crud)')
    .eq('estados_crud.estado_crud', 'Activo')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground mt-1">Gestión de administradores, clientes y técnicos.</p>
        </div>
        <Button asChild>
          <Link href="/usuarios/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios?.map((usuario) => (
                <ClickableRow key={usuario.usuario_id} href={`?view=usuarios&id=${usuario.usuario_id}`}>
                  <TableCell className="font-medium">{usuario.nombre_completo}</TableCell>
                  <TableCell>
                    <RoleBadge rol={usuario.rol} />
                  </TableCell>
                  <TableCell>{usuario.email || '-'}</TableCell>
                  <TableCell>{usuario.telefono || '-'}</TableCell>
                  <TableCell>{usuario.cedula || '-'}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/usuarios/${usuario.usuario_id}`}>
                        <Edit className="h-4 w-4 text-slate-500" />
                      </Link>
                    </Button>
                    <form action={async () => {
                      'use server'
                      await deleteUsuario(usuario.usuario_id)
                    }} className="inline-block">
                      <Button variant="ghost" size="icon" type="submit" title="Eliminar">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </form>
                  </TableCell>
                </ClickableRow>
              ))}
              {(!usuarios || usuarios.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron usuarios activos.
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
