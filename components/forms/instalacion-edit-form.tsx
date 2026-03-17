'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstalacionCascade } from '@/components/ui/cascade-selects'
import { updateInstalacionModal, deleteInstalacionModal } from '@/app/actions/modal-actions'
import { Trash2 } from 'lucide-react'

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function InstalacionEditForm({ instalacion, onSuccess }: { instalacion: any; onSuccess: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const defaultClienteId = Array.isArray(instalacion.sedes?.clientes)
    ? instalacion.sedes?.clientes?.[0]?.nit_id
    : instalacion.sedes?.clientes?.nit_id

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateInstalacionModal(instalacion.instalacion_id, new FormData(e.currentTarget))
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteInstalacionModal(instalacion.instalacion_id)
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Ubicación</Label>
        <div className="grid grid-cols-2 gap-4 border rounded-md p-3 bg-slate-50">
          <InstalacionCascade
            defaultSedeId={instalacion.sedes?.sede_id ?? ''}
            defaultClienteId={defaultClienteId ?? ''}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo">Código Interno</Label>
        <Input id="codigo" name="codigo" defaultValue={instalacion.codigo || ''} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipo_tanque">Tipo de Tanque <span className="text-red-500">*</span></Label>
          <select name="tipo_tanque" id="tipo_tanque" required defaultValue={instalacion.tipo_tanque ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            <option value="Tanque Aéreo">Tanque Aéreo</option>
            <option value="Tanque Subterráneo">Tanque Subterráneo</option>
            <option value="Tanque Plástico">Tanque Plástico</option>
            <option value="Reserva Contra Incendios">Reserva Contra Incendios</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_agua">Tipo de Agua <span className="text-red-500">*</span></Label>
          <select name="tipo_agua" id="tipo_agua" required defaultValue={instalacion.tipo_agua ?? ''} className={selectClass}>
            <option value="" disabled>Seleccione...</option>
            <option value="Potable">Potable</option>
            <option value="Lluvia">No Potable / Lluvia</option>
            <option value="Residual">Residual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacidad">Capacidad <span className="text-red-500">*</span></Label>
          <Input id="capacidad" name="capacidad" type="number" required defaultValue={instalacion.capacidad ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unidad_medida">Unidad de Medida</Label>
          <select name="unidad_medida" id="unidad_medida" defaultValue={instalacion.unidad_medida ?? 'Litros'} className={selectClass}>
            <option value="Litros">Litros</option>
            <option value="Galones">Galones</option>
            <option value="Metros Cúbicos">Metros Cúbicos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_instalacion">Fecha Instalación</Label>
          <Input id="fecha_instalacion" name="fecha_instalacion" type="date"
            defaultValue={instalacion.fecha_instalacion ? instalacion.fecha_instalacion.split('T')[0] : ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frecuencia_mantenimiento">Frecuencia (Días)</Label>
          <Input id="frecuencia_mantenimiento" name="frecuencia_mantenimiento" type="number"
            defaultValue={instalacion.frecuencia_mantenimiento ?? 180} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado Físico <span className="text-red-500">*</span></Label>
          <select name="estado" id="estado" required defaultValue={instalacion.estado ?? 'Operativo'} className={selectClass}>
            <option value="Operativo">Operativo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
        </div>
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
