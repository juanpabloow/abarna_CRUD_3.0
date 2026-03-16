'use client'

import { useState, useEffect } from 'react'
import { getClientesForFilter, getSedesForFilter, getInstalacionesForFilter } from '@/app/actions/filters'
import { useRouter, useSearchParams } from 'next/navigation'

export function AgendasFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientes, setClientes] = useState<any[]>([])
  const [sedes, setSedes] = useState<any[]>([])
  const [instalaciones, setInstalaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const selectedCliente = searchParams.get('cliente') || ''
  const selectedSede = searchParams.get('sede') || ''
  const selectedInstalacion = searchParams.get('instalacion') || ''

  useEffect(() => {
    getClientesForFilter().then(res => {
      setClientes(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (selectedCliente) {
      getSedesForFilter(selectedCliente).then(setSedes)
    } else {
      getSedesForFilter().then(setSedes)
    }
  }, [selectedCliente])

  useEffect(() => {
    if (selectedSede) {
      getInstalacionesForFilter(selectedSede).then(setInstalaciones)
    } else {
      getInstalacionesForFilter().then(setInstalaciones)
    }
  }, [selectedSede])

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)

    if (key === 'cliente') {
      params.delete('sede')
      params.delete('instalacion')
    }
    if (key === 'sede') {
      params.delete('instalacion')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col md:flex-row bg-white p-4 border rounded-lg gap-4 shadow-sm items-end mb-6 z-10 w-full">
      <div className="flex-1 w-full space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtrar por Cliente</label>
        <select 
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCliente}
          onChange={(e) => handleChange('cliente', e.target.value)}
        >
          <option value="">Todos los clientes</option>
          {clientes.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa}</option>)}
        </select>
      </div>
      <div className="flex-1 w-full space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtrar por Sede</label>
        <select 
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedSede}
          onChange={(e) => handleChange('sede', e.target.value)}
        >
          <option value="">Todas las sedes</option>
          {sedes.map(s => <option key={s.sede_id} value={s.sede_id}>{s.nombre_sede}</option>)}
        </select>
      </div>
      <div className="flex-1 w-full space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtrar por Tanque</label>
        <select 
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedInstalacion}
          onChange={(e) => handleChange('instalacion', e.target.value)}
        >
          <option value="">Todos los tanques (instalaciones)</option>
          {instalaciones.map(i => <option key={i.instalacion_id} value={i.instalacion_id}>{i.codigo}</option>)}
        </select>
      </div>
    </div>
  )
}
