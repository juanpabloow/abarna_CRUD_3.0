'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import { updateSedeModal, deleteSedeModal } from '@/app/actions/modal-actions'
import { getCiudadesForSelect, getClientesForSelect } from '@/app/actions/form-data'
import { Trash2 } from 'lucide-react'

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function SedeEditForm({ sede, onSuccess }: { sede: any; onSuccess: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])
  const [ciudades, setCiudades] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getClientesForSelect(), getCiudadesForSelect()]).then(([c, ci]) => {
      setClientes(c)
      setCiudades(ci)
    })
  }, [])

  const initialSelected = (sede.sede_usuarios || [])
    .map((su: any) => su.usuarios)
    .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateSedeModal(sede.sede_id, new FormData(e.currentTarget))
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteSedeModal(sede.sede_id)
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nit_id">Empresa (Cliente) <span className="text-red-500">*</span></Label>
          <select name="nit_id" id="nit_id" required defaultValue={sede.nit_id ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            {clientes.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre_sede">Nombre de la Sede <span className="text-red-500">*</span></Label>
          <Input id="nombre_sede" name="nombre_sede" required defaultValue={sede.nombre_sede} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ciudad_id">Ciudad <span className="text-red-500">*</span></Label>
          <select name="ciudad_id" id="ciudad_id" required defaultValue={sede.ciudad_id ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            {ciudades.map(c => <option key={c.ciudad_id} value={c.ciudad_id}>{c.ciudad}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección Física</Label>
          <Input id="direccion" name="direccion" defaultValue={sede.direccion || ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Encargados de Sede</Label>
        <MultiUserSelect roleFilter="cliente" fieldName="assigned_users" initialSelected={initialSelected} />
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-600 font-medium">¿Confirmar eliminación?</span>
            <Button type="button" variant="destructive" size="sm" disabled={loading} onClick={handleDelete}>Sí, eliminar</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
          </div>
        ) : (
          <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setConfirmDelete(true)} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-1" /> Eliminar
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSuccess} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Button>
        </div>
      </div>
    </form>
  )
}
