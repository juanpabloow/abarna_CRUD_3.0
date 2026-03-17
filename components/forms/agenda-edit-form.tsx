'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AgendaCascade } from '@/components/ui/cascade-selects'
import { MultiUserSelect } from '@/components/ui/multi-user-select'
import { updateAgendaModal, deleteAgendaModal } from '@/app/actions/modal-actions'
import { Trash2 } from 'lucide-react'

const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

export function AgendaEditForm({ agenda, onSuccess }: { agenda: any; onSuccess: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const sedes = agenda.instalaciones?.sedes
  const defaultSedeId = sedes?.sede_id ?? ''
  const defaultClienteId = Array.isArray(sedes?.clientes)
    ? sedes?.clientes?.[0]?.nit_id ?? ''
    : sedes?.clientes?.nit_id ?? ''

  // Strip timezone for datetime-local input
  const formattedDate = agenda.fecha_visita
    ? new Date(agenda.fecha_visita).toISOString().slice(0, 16)
    : ''

  const initialTecnicos = (agenda.agenda_tecnico || [])
    .map((at: any) => at.usuarios)
    .filter(Boolean)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateAgendaModal(agenda.agenda_id, new FormData(e.currentTarget))
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteAgendaModal(agenda.agenda_id)
      router.refresh()
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-500 uppercase tracking-wider">Instalación</Label>
        <div className="border rounded-md p-3 bg-slate-50">
          <AgendaCascade
            defaultInstalacionId={agenda.instalacion_id ?? ''}
            defaultSedeId={defaultSedeId}
            defaultClienteId={defaultClienteId}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_visita">Fecha / Hora de Visita <span className="text-red-500">*</span></Label>
          <Input id="fecha_visita" name="fecha_visita" type="datetime-local" required defaultValue={formattedDate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estatus">Estatus <span className="text-red-500">*</span></Label>
          <select name="estatus" id="estatus" required defaultValue={agenda.estatus ?? 'programada'} className={selectClass}>
            <option value="programada">Programada</option>
            <option value="en_curso">En Curso</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_servicio">Tipo de Servicio <span className="text-red-500">*</span></Label>
        <select name="tipo_servicio" id="tipo_servicio" required defaultValue={agenda.tipo_servicio ?? ''} className={selectClass}>
          <option value="" disabled>Seleccione...</option>
          <option value="Lavado preventivo">Lavado preventivo</option>
          <option value="Inspección técnica">Inspección técnica</option>
          <option value="Reparación">Reparación</option>
          <option value="Instalación nueva">Instalación nueva</option>
          <option value="Muestreo de Agua">Muestreo de Agua</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción / Notas</Label>
        <textarea id="descripcion" name="descripcion" rows={2}
          defaultValue={agenda.descripcion || ''}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Detalles adicionales...">
        </textarea>
      </div>

      <div className="space-y-2">
        <Label>Técnicos Asignados</Label>
        <MultiUserSelect roleFilter="tecnico" fieldName="assigned_tecnicos" initialSelected={initialTecnicos} />
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
