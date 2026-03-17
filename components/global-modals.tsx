'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getEntityDetail } from '@/app/actions/global-modals'
import { UsuarioEditForm } from '@/components/forms/usuario-edit-form'
import { ClienteEditForm } from '@/components/forms/cliente-edit-form'
import { SedeEditForm } from '@/components/forms/sede-edit-form'
import { InstalacionEditForm } from '@/components/forms/instalacion-edit-form'
import { AgendaEditForm } from '@/components/forms/agenda-edit-form'
import { FuenteEditForm } from '@/components/forms/fuente-edit-form'
import { CiudadEditForm } from '@/components/forms/ciudad-edit-form'
import { ExternalLink, Building2, MapPin, Droplet, Calendar as CalendarIcon, Users, Edit } from 'lucide-react'

// Strip timezone offset so stored UTC values are displayed as entered (local time)
const parseAsLocal = (dateStr: string) =>
  new Date(dateStr.replace(/([+-]\d{2}:?\d{2}|Z)$/, ''))

export function GlobalModals() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const view = searchParams.get('view')
  const edit = searchParams.get('edit')
  const id = searchParams.get('id')

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  // Cache last fetch so view→edit transition doesn't re-fetch the same entity
  const lastFetchRef = useRef<{ type: string; id: string } | null>(null)

  useEffect(() => {
    const activeType = view || edit
    if (activeType && id) {
      if (lastFetchRef.current?.type === activeType && lastFetchRef.current?.id === id) return
      lastFetchRef.current = { type: activeType, id }
      setLoading(true)
      getEntityDetail(activeType, id).then(res => {
        setData(res)
        setLoading(false)
      })
    } else {
      setData(null)
      lastFetchRef.current = null
    }
  }, [view, edit, id])

  const closeModal = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('view')
    params.delete('edit')
    params.delete('id')
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const openEdit = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('view')
    params.set('edit', view!)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const navigateTo = (newView: string, newId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('view', newView)
    params.set('id', newId)
    params.delete('edit')
    router.push(`?${params.toString()}`, { scroll: false })
  }

  if (!view && !edit) return null
  if (!id) return null

  // ─── VIEW TITLES ─────────────────────────────────────────────────────────
  const getViewTitle = () => {
    if (!data) return 'Detalles'
    switch (view) {
      case 'clientes':      return `Cliente: ${data.nombre_empresa}`
      case 'sedes':         return `Sede: ${data.nombre_sede}`
      case 'instalaciones': return `Instalación: ${data.codigo}`
      case 'usuarios':      return `Usuario: ${data.nombre_completo}`
      case 'agendas':       return `Agenda: ${parseAsLocal(data.fecha_visita).toLocaleDateString()}`
      default:              return 'Detalles'
    }
  }

  // ─── EDIT TITLES ─────────────────────────────────────────────────────────
  const getEditTitle = () => {
    if (!data) return 'Editar'
    switch (edit) {
      case 'clientes':      return `Editar cliente: ${data.nombre_empresa}`
      case 'sedes':         return `Editar sede: ${data.nombre_sede}`
      case 'instalaciones': return `Editar instalación: ${data.codigo}`
      case 'usuarios':      return `Editar usuario: ${data.nombre_completo}`
      case 'agendas':       return `Editar agenda`
      case 'fuentes':       return `Editar fuente: ${data.fuente}`
      case 'ciudades':      return `Editar ciudad: ${data.ciudad}`
      default:              return 'Editar'
    }
  }

  // ─── DETAIL CONTENT ──────────────────────────────────────────────────────
  const renderDetail = () => {
    if (loading) return <div className="py-12 text-center text-muted-foreground animate-pulse">Cargando detalles...</div>
    if (!data)   return <div className="py-12 text-center text-red-500">No se encontraron datos.</div>

    switch (view) {
      case 'clientes':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Building2 className="w-4 h-4 mr-2" />Información de Empresa</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">NIT:</span> {data.nit_id}</div>
                <div><span className="font-medium">Tipo:</span> {data.tipo_personas?.tipo_persona}</div>
                <div><span className="font-medium">Email:</span> {data.email_empresa || '-'}</div>
                <div><span className="font-medium">Teléfono:</span> {data.telefono_empresa || '-'}</div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2" />Contactos Asociados</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.cliente_usuarios?.map((cu: any, i: number) => (
                  <div key={i} className="text-sm bg-white border p-2 rounded-md flex justify-between items-center">
                    <span className="font-medium">{cu.usuarios?.nombre_completo}</span>
                    <span className="text-muted-foreground text-xs">{cu.usuarios?.email || cu.usuarios?.telefono}</span>
                  </div>
                ))}
                {(!data.cliente_usuarios || data.cliente_usuarios.length === 0) && <p className="text-sm text-muted-foreground">Sin contactos</p>}
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2" />Sedes Relacionadas</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.sedes?.map((s: any, i: number) => (
                  <button key={i} onClick={() => navigateTo('sedes', s.sede_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                    <span className="font-medium">{s.nombre_sede}</span>
                    <span className="text-xs flex items-center">{s.ciudades?.ciudad} <ExternalLink className="w-3 h-3 ml-2" /></span>
                  </button>
                ))}
                {(!data.sedes || data.sedes.length === 0) && <p className="text-sm text-muted-foreground">Sin sedes</p>}
              </div>
            </div>
          </div>
        )

      case 'sedes':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2" />Información de Sede</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Ciudad:</span> {data.ciudades?.ciudad}</div>
                <div><span className="font-medium">Dirección:</span> {data.direccion || '-'}</div>
                <div className="col-span-2">
                  <span className="font-medium">Cliente Padre:</span>{' '}
                  <button onClick={() => navigateTo('clientes', data.clientes?.nit_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {data.clientes?.nombre_empresa} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Droplet className="w-4 h-4 mr-2" />Instalaciones</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.instalaciones?.map((inst: any, i: number) => (
                  <button key={i} onClick={() => navigateTo('instalaciones', inst.instalacion_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                    <span className="font-medium">Tanque {inst.codigo}</span>
                    <span className="text-xs flex items-center">{inst.capacidad} {inst.tipo_tanque} <ExternalLink className="w-3 h-3 ml-2" /></span>
                  </button>
                ))}
                {(!data.instalaciones || data.instalaciones.length === 0) && <p className="text-sm text-muted-foreground">Sin instalaciones</p>}
              </div>
            </div>
          </div>
        )

      case 'instalaciones':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Droplet className="w-4 h-4 mr-2" />Datos de Instalación</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Código:</span> {data.codigo}</div>
                <div><span className="font-medium">Tanque:</span> {data.tipo_tanque}</div>
                <div><span className="font-medium">Capacidad:</span> {data.capacidad} {data.unidad_medida}</div>
                <div><span className="font-medium">Agua:</span> {data.tipo_agua}</div>
                <div><span className="font-medium">Estado Físico:</span> {data.estado}</div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2" />Ubicación</h4>
              <div className="text-sm bg-white border p-3 rounded-md space-y-2">
                <div>
                  <span className="font-medium">Sede:</span>{' '}
                  <button onClick={() => navigateTo('sedes', data.sedes?.sede_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {data.sedes?.nombre_sede} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div>
                  <span className="font-medium">Cliente:</span>{' '}
                  <button onClick={() => navigateTo('clientes', Array.isArray(data.sedes?.clientes) ? data.sedes?.clientes[0]?.nit_id : data.sedes?.clientes?.nit_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {Array.isArray(data.sedes?.clientes) ? data.sedes?.clientes[0]?.nombre_empresa : data.sedes?.clientes?.nombre_empresa} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><CalendarIcon className="w-4 h-4 mr-2" />Historial Agendas</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.agenda?.map((ag: any, i: number) => (
                  <button key={i} onClick={() => navigateTo('agendas', ag.agenda_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                    <span className="font-medium">{parseAsLocal(ag.fecha_visita).toLocaleDateString()}</span>
                    <span className="text-xs flex items-center">{ag.estatus} <ExternalLink className="w-3 h-3 ml-2" /></span>
                  </button>
                ))}
                {(!data.agenda || data.agenda.length === 0) && <p className="text-sm text-muted-foreground">Sin mantenimientos programados</p>}
              </div>
            </div>
          </div>
        )

      case 'usuarios':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2" />Información de Usuario</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Email:</span> {data.email || '-'}</div>
                <div><span className="font-medium">Teléfono:</span> {data.telefono || '-'}</div>
                <div><span className="font-medium">Cédula:</span> {data.cedula || '-'}</div>
                <div><span className="font-medium">Rol:</span> <span className="capitalize">{data.rol}</span></div>
              </div>
            </div>
            {data.rol === 'cliente' && (
              <div>
                <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Building2 className="w-4 h-4 mr-2" />Clientes Vinculados</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {data.cliente_usuarios?.map((cu: any, i: number) => (
                    <button key={i} onClick={() => navigateTo('clientes', cu.clientes?.nit_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                      <span className="font-medium">{cu.clientes?.nombre_empresa}</span>
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </button>
                  ))}
                  {(!data.cliente_usuarios || data.cliente_usuarios.length === 0) && <p className="text-sm text-muted-foreground">Sin empresas</p>}
                </div>
              </div>
            )}
          </div>
        )

      case 'agendas':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><CalendarIcon className="w-4 h-4 mr-2" />Datos de Agenda</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Fecha Visita:</span> {parseAsLocal(data.fecha_visita).toLocaleString()}</div>
                <div><span className="font-medium">Estado:</span> {data.estatus}</div>
                <div><span className="font-medium">Tipo Servicio:</span> {data.tipo_servicio}</div>
                <div><span className="font-medium">Observaciones:</span> {data.descripcion || '-'}</div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2" />Instalación Destino</h4>
              <div className="text-sm bg-white border p-3 rounded-md space-y-2">
                <div>
                  <span className="font-medium">Instalación:</span>{' '}
                  <button onClick={() => navigateTo('instalaciones', data.instalaciones?.instalacion_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    Tanque {data.instalaciones?.codigo} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div>
                  <span className="font-medium">Sede:</span>{' '}
                  <button onClick={() => navigateTo('sedes', data.instalaciones?.sedes?.sede_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {data.instalaciones?.sedes?.nombre_sede} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2" />Técnicos Asignados</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.agenda_tecnico?.map((at: any, i: number) => (
                  <button key={i} onClick={() => navigateTo('usuarios', at.usuarios?.usuario_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                    <span className="font-medium">{at.usuarios?.nombre_completo}</span>
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </button>
                ))}
                {(!data.agenda_tecnico || data.agenda_tecnico.length === 0) && <p className="text-sm text-muted-foreground">Sin técnicos</p>}
              </div>
            </div>
          </div>
        )

      default:
        return <div className="py-6 text-center text-muted-foreground">Vista no disponible.</div>
    }
  }

  // ─── EDIT FORM ───────────────────────────────────────────────────────────
  const renderEditForm = () => {
    if (loading) return <div className="py-12 text-center text-muted-foreground animate-pulse">Cargando formulario...</div>
    if (!data)   return <div className="py-12 text-center text-red-500">No se encontraron datos.</div>

    switch (edit) {
      case 'usuarios':      return <UsuarioEditForm      usuario={data}     onSuccess={closeModal} />
      case 'clientes':      return <ClienteEditForm      cliente={data}     onSuccess={closeModal} />
      case 'sedes':         return <SedeEditForm         sede={data}        onSuccess={closeModal} />
      case 'instalaciones': return <InstalacionEditForm  instalacion={data} onSuccess={closeModal} />
      case 'agendas':       return <AgendaEditForm       agenda={data}      onSuccess={closeModal} />
      case 'fuentes':       return <FuenteEditForm       fuente={data}      onSuccess={closeModal} />
      case 'ciudades':      return <CiudadEditForm       ciudad={data}      onSuccess={closeModal} />
      default:              return <div className="py-6 text-center text-muted-foreground">Formulario no disponible.</div>
    }
  }

  // Entities that have a meaningful detail view (others go straight to edit)
  const hasDetailView = ['clientes', 'sedes', 'instalaciones', 'usuarios', 'agendas'].includes(view || '')

  return (
    <>
      {/* ── Detail Dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!view && !!id && hasDetailView} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{getViewTitle()}</DialogTitle>
          </DialogHeader>
          <div className="py-2">{renderDetail()}</div>
          <DialogFooter className="border-t pt-4 sm:justify-between">
            <Button variant="outline" onClick={closeModal}>Cerrar</Button>
            {!loading && data && (
              <Button onClick={openEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Editar {view === 'instalaciones' ? 'instalación' : view?.slice(0, -1)}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ───────────────────────────────────────────────── */}
      <Dialog open={!!edit && !!id} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{getEditTitle()}</DialogTitle>
          </DialogHeader>
          <div className="py-2">{renderEditForm()}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
