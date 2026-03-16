'use client'

import { useState, useEffect } from 'react'
import { getClientesForFilter, getSedesForFilter } from '@/app/actions/filters'
import { useRouter, useSearchParams } from 'next/navigation'

export function InstalacionesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientes, setClientes] = useState<any[]>([])
  const [sedes, setSedes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const selectedCliente = searchParams.get('cliente') || ''
  const selectedSede = searchParams.get('sede') || ''

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

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('cliente', e.target.value)
    } else {
      params.delete('cliente')
    }
    params.delete('sede') // Reset child
    router.push(`?${params.toString()}`)
  }

  const handleSedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('sede', e.target.value)
    } else {
      params.delete('sede')
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex bg-white p-4 border rounded-lg gap-4 shadow-sm items-end mb-6 z-10 w-full md:w-auto">
      <div className="flex-1 min-w-[200px] space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtrar por Cliente</label>
        <select 
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCliente}
          onChange={handleClienteChange}
        >
          <option value="">Todos los clientes</option>
          {clientes.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[200px] space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filtrar por Sede</label>
        <select 
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedSede}
          onChange={handleSedeChange}
        >
          <option value="">Todas las sedes</option>
          {sedes.map(s => <option key={s.sede_id} value={s.sede_id}>{s.nombre_sede}</option>)}
        </select>
      </div>
    </div>
  )
}
