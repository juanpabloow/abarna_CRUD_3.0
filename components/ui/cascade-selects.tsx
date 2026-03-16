'use client'

import { useState, useEffect } from 'react'
import { getClientesForFilter, getSedesForFilter, getInstalacionesForFilter } from '@/app/actions/filters'
import { Label } from '@/components/ui/label'

export function InstalacionCascade({ defaultSedeId = '', defaultClienteId = '' }: { defaultSedeId?: string, defaultClienteId?: string }) {
  const [clientes, setClientes] = useState<any[]>([])
  const [sedes, setSedes] = useState<any[]>([])
  const [selectedCliente, setSelectedCliente] = useState<string>(defaultClienteId)
  const [selectedSede, setSelectedSede] = useState<string>(defaultSedeId)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientesForFilter().then(res => {
      setClientes(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    getSedesForFilter(selectedCliente || undefined).then(setSedes)
  }, [selectedCliente])

  return (
    <>
      <div className="space-y-2">
        <Label>Empresa / Cliente Filtro</Label>
        <select 
          disabled={loading}
          value={selectedCliente}
          onChange={(e) => {
             setSelectedCliente(e.target.value)
             setSelectedSede('')
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Todos los clientes...</option>
          {clientes.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sede_id">Sede <span className="text-red-500">*</span></Label>
        <select 
          required
          name="sede_id"
          id="sede_id"
          disabled={loading}
          value={selectedSede}
          onChange={(e) => setSelectedSede(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>Seleccione la sede...</option>
          {sedes.map(s => <option key={s.sede_id} value={s.sede_id}>{s.nombre_sede}</option>)}
        </select>
      </div>
    </>
  )
}

export function AgendaCascade({ 
  defaultInstalacionId = '', 
  defaultSedeId = '', 
  defaultClienteId = '' 
}: { 
  defaultInstalacionId?: string
  defaultSedeId?: string
  defaultClienteId?: string
}) {
  const [clientes, setClientes] = useState<any[]>([])
  const [sedes, setSedes] = useState<any[]>([])
  const [instalaciones, setInstalaciones] = useState<any[]>([])
  
  const [selectedCliente, setSelectedCliente] = useState<string>(defaultClienteId)
  const [selectedSede, setSelectedSede] = useState<string>(defaultSedeId)
  const [selectedInstalacion, setSelectedInstalacion] = useState<string>(defaultInstalacionId)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClientesForFilter().then(res => {
      setClientes(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    getSedesForFilter(selectedCliente || undefined).then(setSedes)
  }, [selectedCliente])

  useEffect(() => {
    getInstalacionesForFilter(selectedSede || undefined).then(setInstalaciones)
  }, [selectedSede])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>1. Cliente Filtro</Label>
        <select 
          disabled={loading}
          value={selectedCliente}
          onChange={(e) => {
             setSelectedCliente(e.target.value)
             setSelectedSede('')
             setSelectedInstalacion('')
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Todos los clientes...</option>
          {clientes.map(c => <option key={c.nit_id} value={c.nit_id}>{c.nombre_empresa}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>2. Sede Filtro</Label>
        <select 
          disabled={loading}
          value={selectedSede}
          onChange={(e) => {
            setSelectedSede(e.target.value)
            setSelectedInstalacion('')
          }}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Todas las sedes...</option>
          {sedes.map(s => <option key={s.sede_id} value={s.sede_id}>{s.nombre_sede}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="instalacion_id">3. Tanque <span className="text-red-500">*</span></Label>
        <select 
          required
          name="instalacion_id"
          id="instalacion_id"
          disabled={loading}
          value={selectedInstalacion}
          onChange={(e) => setSelectedInstalacion(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>Seleccione el tanque...</option>
          {instalaciones.map(i => <option key={i.instalacion_id} value={i.instalacion_id}>{i.codigo}</option>)}
        </select>
      </div>
    </div>
  )
}
