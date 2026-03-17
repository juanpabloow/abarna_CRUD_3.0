'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateFuenteModal, deleteFuenteModal } from '@/app/actions/modal-actions'
import { Trash2 } from 'lucide-react'

export function FuenteEditForm({ fuente, onSuccess }: { fuente: any; onSuccess: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateFuenteModal(fuente.fuente_id, new FormData(e.currentTarget))
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteFuenteModal(fuente.fuente_id)
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fuente">Nombre de la Fuente <span className="text-red-500">*</span></Label>
        <Input id="fuente" name="fuente" required defaultValue={fuente.fuente} />
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
