'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUsuario, deleteUsuario } from '@/app/usuarios/actions'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function UsuarioEditForm({ usuario, onSuccess }: { usuario: any, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await updateUsuario(usuario.usuario_id, formData)
    setLoading(false)
    onSuccess()
  }

  const handleDelete = async () => {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      setLoading(true)
      await deleteUsuario(usuario.usuario_id)
      setLoading(false)
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-1">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre_completo">Nombre Completo <span className="text-red-500">*</span></Label>
          <Input id="nombre_completo" name="nombre_completo" required defaultValue={usuario.nombre_completo} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={usuario.email || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" defaultValue={usuario.telefono || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input id="cedula" name="cedula" defaultValue={usuario.cedula || ''} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rol">Rol <span className="text-red-500">*</span></Label>
          <select name="rol" id="rol" required defaultValue={usuario.rol} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="cliente">Cliente</option>
            <option value="tecnico">Técnico</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <Button disabled={loading} type="button" variant="destructive" size="icon" onClick={handleDelete} title="Eliminar usuario">
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="space-x-2">
          <Button disabled={loading} type="button" variant="outline" onClick={onSuccess}>Cancelar</Button>
          <Button disabled={loading} type="submit">Guardar Cambios</Button>
        </div>
      </div>
    </form>
  )
}
