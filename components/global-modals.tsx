'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { getEntityDetail } from '@/app/actions/global-modals'
import { UsuarioEditForm } from '@/components/forms/usuario-edit-form'
import Link from 'next/link'
import { ExternalLink, Building2, MapPin, Droplet, Calendar as CalendarIcon, Users, Edit } from 'lucide-react'

export function GlobalModals() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const view = searchParams.get('view')
  const edit = searchParams.get('edit')
  const id = searchParams.get('id')
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const activeType = view || edit
    if (activeType && id) {
      setLoading(true)
      getEntityDetail(activeType, id).then(res => {
        setData(res)
        setLoading(false)
      })
    } else {
      setData(null)
    }
  }, [view, edit, id])

  const closeModal = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('view')
    params.delete('edit')
    params.delete('id')
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const navigateTo = (newView: string, newId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('view', newView)
    params.set('id', newId)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  if (!view && !edit) return null
  if (!id) return null

  const renderContent = () => {
    if (loading) return <div className="py-12 text-center text-muted-foreground animate-pulse">Cargando detalles...</div>
    if (!data) return <div className="py-12 text-center text-red-500">No se encontraron datos.</div>

    switch (view) {
      case 'clientes':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Building2 className="w-4 h-4 mr-2"/> Información de Empresa</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">NIT:</span> {data.nit_id}</div>
                <div><span className="font-medium">Tipo:</span> {data.tipo_personas?.tipo_persona}</div>
                <div><span className="font-medium">Email:</span> {data.email_empresa || '-'}</div>
                <div><span className="font-medium">Teléfono:</span> {data.telefono_empresa || '-'}</div>
              </div>
            </div>

            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2"/> Contactos Asociados</h4>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Sedes Relacionadas</h4>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Información de Sede</h4>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Droplet className="w-4 h-4 mr-2"/> Instalaciones</h4>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Droplet className="w-4 h-4 mr-2"/> Datos de Instalación</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Código:</span> {data.codigo}</div>
                <div><span className="font-medium">Tanque:</span> {data.tipo_tanque}</div>
                <div><span className="font-medium">Capacidad:</span> {data.capacidad} {data.unidad_medida}</div>
                <div><span className="font-medium">Agua:</span> {data.tipo_agua}</div>
                <div><span className="font-medium">Estado Físico:</span> {data.estado}</div>
              </div>
            </div>

            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Ubicación</h4>
              <div className="text-sm bg-white border p-3 rounded-md space-y-2">
                <div>
                  <span className="font-medium">Sede:</span>{' '}
                  <button onClick={() => navigateTo('sedes', data.sedes?.sede_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {data.sedes?.nombre_sede} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div>
                  <span className="font-medium">Cliente:</span>{' '}
                  <button onClick={() => navigateTo('clientes', data.sedes?.clientes?.[0]?.nit_id || data.sedes?.clientes?.nit_id)} className="text-blue-600 hover:underline inline-flex items-center">
                    {Array.isArray(data.sedes?.clientes) ? data.sedes?.clientes[0]?.nombre_empresa : data.sedes?.clientes?.nombre_empresa} <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><CalendarIcon className="w-4 h-4 mr-2"/> Historial Agendas</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {data.agenda?.map((ag: any, i: number) => (
                  <button key={i} onClick={() => navigateTo('agendas', ag.agenda_id)} className="w-full text-left text-sm bg-blue-50/50 hover:bg-blue-100 border border-blue-100 text-blue-700 p-2 rounded-md flex justify-between items-center transition-colors">
                    <span className="font-medium">{new Date(ag.fecha_visita).toLocaleDateString()}</span>
                    <span className="text-xs flex items-center">{ag.estado || ag.estatus} <ExternalLink className="w-3 h-3 ml-2" /></span>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2"/> Información de Usuario</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Email:</span> {data.email || '-'}</div>
                <div><span className="font-medium">Teléfono:</span> {data.telefono || '-'}</div>
                <div><span className="font-medium">Cédula:</span> {data.cedula || '-'}</div>
                <div><span className="font-medium">Rol:</span> <span className="capitalize">{data.rol}</span></div>
              </div>
            </div>
            {data.rol === 'cliente' && (
              <>
               <div>
                 <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Building2 className="w-4 h-4 mr-2"/> Clientes Vinculados</h4>
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
              </>
            )}
          </div>
        )

      case 'agendas':
        return (
          <div className="space-y-6">
             <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><CalendarIcon className="w-4 h-4 mr-2"/> Datos de Agenda</h4>
              <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-md border">
                <div><span className="font-medium">Fecha Visita:</span> {new Date(data.fecha_visita).toLocaleString()}</div>
                <div><span className="font-medium">Estado:</span> {data.estatus || data.estado}</div>
                <div><span className="font-medium">Observaciones:</span> {data.observaciones || '-'}</div>
              </div>
            </div>
            <div>
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><MapPin className="w-4 h-4 mr-2"/> Instalación Destino</h4>
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
              <h4 className="flex items-center text-sm font-semibold mb-2 text-slate-500 uppercase tracking-wider"><Users className="w-4 h-4 mr-2"/> Técnicos Asignados</h4>
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
        return <div>Vista no soportada</div>
    }
  }

  const getType = () => view || edit

  const getTitle = () => {
    if (!data) return 'Detalles'
    switch (getType()) {
      case 'clientes': return `Cliente: ${data.nombre_empresa}`
      case 'sedes': return `Sede: ${data.nombre_sede}`
      case 'instalaciones': return `Instalación: ${data.codigo}`
      case 'usuarios': return `Usuario: ${data.nombre_completo}`
      case 'agendas': return `Agenda Visit: ${new Date(data.fecha_visita).toLocaleDateString()}`
      default: return 'Detalles'
    }
  }

  return (
    <>
      {/* View Dialog */}
      <Dialog open={!!view && !!id} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{getTitle()}</DialogTitle>
          </DialogHeader>
          
          <div className="py-2">
            {renderContent()}
          </div>

          <DialogFooter className="border-t pt-4 sm:justify-between">
            <Button variant="outline" onClick={closeModal}>Cerrar</Button>
            {!loading && data && view && (
              <Button onClick={() => router.replace(`?edit=${view}&id=${id}`, { scroll: false })}>
                <Edit className="w-4 h-4 mr-2"/> Editar {view.slice(0, -1)}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drawer (Sheet) */}
      <Sheet open={!!edit && !!id} onOpenChange={(open) => !open && closeModal()}>
        <SheetContent className="overflow-y-auto sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle className="text-xl">Editar {getTitle()}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground animate-pulse">Cargando formulario...</div>
            ) : data ? (
              <>
                {edit === 'usuarios' ? (
                  <UsuarioEditForm usuario={data} onSuccess={closeModal} />
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <p className="text-muted-foreground">La edición en panel aún no está implementada para {edit}.</p>
                    <div className="mt-4">
                      <Link href={`/${edit}/${id}`} onClick={closeModal} className="text-sm font-medium hover:underline">
                        Ir a página completa de edición
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-red-500">Error al cargar datos.</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
