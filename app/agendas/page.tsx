import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import CalendarView, { AgendaEvent } from '@/components/calendar-view'
import { AgendasFilter } from '@/components/agendas-filter'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const revalidate = 0

export default async function AgendasPage({ searchParams }: { searchParams: Promise<{ cliente?: string, sede?: string, instalacion?: string }> }) {
  const resolvedSearchParams = await searchParams
  const { cliente, sede, instalacion } = resolvedSearchParams || {}

  const supabase = await createClient()
  let query = supabase
    .from('agendas')
    .select(`
      *,
      instalaciones!inner(codigo, sede_id, sedes!inner(nombre_sede, nit_id, clientes(nombre_empresa)))
    `)

  if (instalacion) {
    query = query.eq('instalacion_id', instalacion)
  } else if (sede) {
    query = query.eq('instalaciones.sede_id', sede)
  } else if (cliente) {
    query = query.eq('instalaciones.sedes.nit_id', cliente)
  }

  const { data: agendas } = await query

  // Strip the timezone offset so the stored time is treated as local time.
  // The datetime-local input submits without tz info; Supabase stores it as UTC.
  // Parsing without the offset prevents the browser from shifting the hour.
  const parseAsLocal = (dateStr: string) =>
    new Date(dateStr.replace(/([+-]\d{2}:?\d{2}|Z)$/, ''))

  // Map to the format needed by react-big-calendar
  const eventos: AgendaEvent[] = (agendas || []).map(agenda => {
    const startDate = parseAsLocal(agenda.fecha_visita)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

    const clienteName = (agenda as any).instalaciones?.sedes?.clientes?.nombre_empresa || 'Sin Cliente'
    const sedeName = (agenda as any).instalaciones?.sedes?.nombre_sede || ''
    
    return {
      id: agenda.agenda_id,
      title: `${clienteName} - ${agenda.tipo_servicio}`,
      start: startDate,
      end: endDate,
      resource: agenda
    }
  })

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agendas de Visitas</h2>
          <p className="text-muted-foreground mt-1">Calendario operativo de mantenimientos e instalaciones.</p>
        </div>
        <Button asChild>
          <Link href="/agendas/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Agendar Visita
          </Link>
        </Button>
      </div>

      <AgendasFilter />

      <div className="flex-1 w-full">
        <CalendarView eventos={eventos} />
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground pt-2 shrink-0">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Programada</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> En Curso</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Realizada</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Cancelada</div>
      </div>
    </div>
  )
}
