'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import { updateClienteModal, deleteClienteModal } from '@/app/actions/modal-actions'
import { getTipoPersonas, getFuentesForSelect } from '@/app/actions/form-data'
import { Trash2 } from 'lucide-react'

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function ClienteEditForm({ cliente, onSuccess }: { cliente: any; onSuccess: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [tipos, setTipos] = useState<any[]>([])
  const [fuentes, setFuentes] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getTipoPersonas(), getFuentesForSelect()]).then(([t, f]) => {
      setTipos(t)
      setFuentes(f)
    })
  }, [])

  const initialSelected = (cliente.cliente_usuarios || [])
    .map((cu: any) => cu.usuarios)
    .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateClienteModal(cliente.nit_id, new FormData(e.currentTarget))
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteClienteModal(cliente.nit_id)
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
          <Label>NIT / Documento</Label>
          <Input value={cliente.nit_id} disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre_empresa">Nombre / Razón Social <span className="text-red-500">*</span></Label>
          <Input id="nombre_empresa" name="nombre_empresa" required defaultValue={cliente.nombre_empresa} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo_persona_id">Tipo de Cliente <span className="text-red-500">*</span></Label>
          <select name="tipo_persona_id" id="tipo_persona_id" required defaultValue={cliente.tipo_persona_id ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            {tipos.map(t => <option key={t.tipo_persona_id} value={t.tipo_persona_id}>{t.tipo_persona}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuente_id">Fuente <span className="text-red-500">*</span></Label>
          <select name="fuente_id" id="fuente_id" required defaultValue={cliente.fuente_id ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            {fuentes.map(f => <option key={f.fuente_id} value={f.fuente_id}>{f.fuente}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email_empresa">Correo de Facturación</Label>
          <Input id="email_empresa" name="email_empresa" type="email" defaultValue={cliente.email_empresa || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono_empresa">Teléfono Empresa</Label>
          <Input id="telefono_empresa" name="telefono_empresa" defaultValue={cliente.telefono_empresa || ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Usuarios de Contacto</Label>
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
