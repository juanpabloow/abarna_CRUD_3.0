'use client'

import { Calendar, dateFnsLocalizer, Event as CalendarEvent } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { es } from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay visitas en este rango.',
  showMore: (total: number) => `+ Ver más (${total})`
}

export type AgendaEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: any
}

export default function CalendarView({ eventos }: { eventos: AgendaEvent[] }) {
  const router = useRouter()
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
    const isoDate = slotInfo.start.toISOString().split('T')[0]
    router.push(`/agendas/nuevo?date=${isoDate}`)
  }

  const handleSelectEvent = (event: AgendaEvent) => {
    router.push(`?view=agendas&id=${event.id}`, { scroll: false })
  }

  const eventPropGetter = (event: AgendaEvent) => {
    let backgroundColor = '#3b82f6' // default blue (programada)
    if (event.resource.estatus === 'realizada') backgroundColor = '#10b981' // green
    if (event.resource.estatus === 'en_curso') backgroundColor = '#f59e0b' // yellow
    if (event.resource.estatus === 'cancelada') backgroundColor = '#ef4444' // red

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    }
  }

  return (
    <Card className="shadow-none border-0 md:border md:shadow-sm">
      <CardContent className="p-0 sm:p-4">
        <div className="h-[75vh] min-h-[500px] w-full bg-white rounded-lg">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            culture="es"
            views={['month', 'week', 'agenda']}
            defaultView="month"
            view={view as any}
            onView={(v: any) => setView(v)}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            className="font-sans text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}
