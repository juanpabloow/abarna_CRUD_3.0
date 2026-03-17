'use client'

import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, isSameMinute } from 'date-fns'
import { es } from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, CalendarDays, ArrowRight, GripVertical } from 'lucide-react'
import { rescheduleAgenda } from '@/app/actions/modal-actions'

// ─── Calendar setup ──────────────────────────────────────────────────────────

const locales = { es }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Wrap Calendar with the official DnD addon (bundled with react-big-calendar).
// Cast to any to avoid fighting react-big-calendar's generic inference quirks.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DnDCalendar = withDragAndDrop(Calendar as any) as any

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

// ─── Types ───────────────────────────────────────────────────────────────────

export type AgendaEvent = {
  id: string
  title: string
  start: Date
  end: Date
  resource: any
}

type PendingMove = {
  event: AgendaEvent
  newStart: Date
  newEnd: Date
}

type Toast = { message: string; type: 'success' | 'error' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Format a date for display in confirmation dialog (Spanish, human-readable)
const fmtDateTime = (d: Date) =>
  format(d, "EEEE d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })

// Format a date as a naive datetime string for storage (avoids tz offset issues)
const fmtForStorage = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm")

// Events that are finished or cancelled should not be reschedulable
const isDraggable = (event: AgendaEvent) =>
  event.resource?.estatus !== 'realizada' && event.resource?.estatus !== 'cancelada'

// ─── Custom toolbar ──────────────────────────────────────────────────────────

function CustomToolbar({ label, onNavigate, onView, view }: ToolbarProps<AgendaEvent>) {
  const viewLabels: Record<string, string> = { month: 'Mes', week: 'Semana', agenda: 'Agenda' }
  return (
    <div className="flex items-center justify-between mb-3 px-1 gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={() => onNavigate('PREV')} title="Período anterior" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate('TODAY')} title="Hoy" className="h-8 w-8">
          <CalendarDays className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate('NEXT')} title="Período siguiente" className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-sm font-semibold capitalize text-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {(['month', 'week', 'agenda'] as const).map((v) => (
          <Button key={v} size="sm" variant={view === v ? 'default' : 'outline'}
            onClick={() => onView(v)} className="h-8 text-xs px-3">
            {viewLabels[v]}
          </Button>
        ))}
      </div>
    </div>
  )
}

// ─── Custom month-view event ─────────────────────────────────────────────────

function MonthEvent({ event }: { event: AgendaEvent }) {
  const timeStr = format(event.start, 'HH:mm')
  const clientPart = event.title.split(' - ')[0]
  const draggable = isDraggable(event)
  return (
    <span className="flex items-baseline gap-1 truncate text-xs leading-tight"
      title={draggable ? 'Arrastra para reprogramar' : 'No se puede reprogramar (realizada/cancelada)'}>
      {draggable && <GripVertical className="h-2.5 w-2.5 shrink-0 opacity-60" />}
      <span className="font-semibold shrink-0">{timeStr}</span>
      <span className="truncate opacity-90">· {clientPart}</span>
    </span>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function CalendarView({ eventos }: { eventos: AgendaEvent[] }) {
  const router = useRouter()
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month')
  const [date, setDate] = useState(new Date())

  // Local copy of events for optimistic DnD updates
  const [localEvents, setLocalEvents] = useState<AgendaEvent[]>(eventos)

  // Sync when the server-rendered prop updates (after router.refresh())
  useEffect(() => { setLocalEvents(eventos) }, [eventos])

  // Pending move waiting for user confirmation
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null)
  const [saving, setSaving] = useState(false)

  // Simple auto-dismiss toast
  const [toast, setToast] = useState<Toast | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [])

  // ── Slot click → create new agenda ────────────────────────────────────────
  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const isoDate = slotInfo.start.toISOString().split('T')[0]
    router.push(`/agendas/nuevo?date=${isoDate}`)
  }

  // ── Event click → detail popup ─────────────────────────────────────────────
  // Must NOT fire during a drag — react-big-calendar handles this distinction
  // by not calling onSelectEvent when the user drags. Normal click behavior is
  // preserved because the DnD addon uses onMouseDown to start a drag only when
  // movement is detected; a simple click still routes through onSelectEvent.
  const handleSelectEvent = (event: AgendaEvent) => {
    router.push(`?view=agendas&id=${event.id}`, { scroll: false })
  }

  // ── Drag & drop: intercept drop, show confirmation ─────────────────────────
  const handleEventDrop = useCallback(
    ({ event, start, end }: EventInteractionArgs<AgendaEvent>) => {
      const newStart = new Date(start)
      const newEnd = new Date(end)

      // No-op if dropped on the same slot
      if (isSameMinute(newStart, event.start)) return

      // Optimistically update local events so the card visually moves
      setLocalEvents(prev =>
        prev.map(e =>
          e.id === event.id ? { ...e, start: newStart, end: newEnd } : e
        )
      )

      // Queue the move for confirmation
      setPendingMove({ event, newStart, newEnd })
    },
    []
  )

  // ── Confirmation: save ─────────────────────────────────────────────────────
  const confirmMove = async () => {
    if (!pendingMove) return
    setSaving(true)
    try {
      await rescheduleAgenda(pendingMove.event.id, fmtForStorage(pendingMove.newStart))
      router.refresh() // triggers server re-fetch → eventos prop updates → localEvents syncs
      setToast({ message: 'Agenda reprogramada correctamente', type: 'success' })
    } catch {
      // Revert optimistic update
      setLocalEvents(eventos)
      setToast({ message: 'No se pudo reprogramar la agenda', type: 'error' })
    } finally {
      setSaving(false)
      setPendingMove(null)
    }
  }

  // ── Confirmation: cancel ───────────────────────────────────────────────────
  const cancelMove = () => {
    // Revert the optimistic visual update
    setLocalEvents(eventos)
    setPendingMove(null)
  }

  // ── Event styling ──────────────────────────────────────────────────────────
  const eventPropGetter = (event: AgendaEvent) => {
    let backgroundColor = '#3b82f6'
    if (event.resource.estatus === 'realizada') backgroundColor = '#10b981'
    if (event.resource.estatus === 'en_curso') backgroundColor = '#f59e0b'
    if (event.resource.estatus === 'cancelada') backgroundColor = '#ef4444'

    const notDraggable = !isDraggable(event)
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: notDraggable ? 0.65 : 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        cursor: notDraggable ? 'default' : 'grab',
      }
    }
  }

  return (
    <>
      <Card className="shadow-none border-0 md:border md:shadow-sm">
        <CardContent className="p-0 sm:p-4">
          <div className="h-[75vh] min-h-[500px] w-full bg-white rounded-lg">
            <DnDCalendar
              localizer={localizer}
              events={localEvents}
              startAccessor="start"
              endAccessor="end"
              messages={messages}
              culture="es"
              views={['month', 'week', 'agenda']}
              defaultView="month"
              view={view}
              date={date}
              onNavigate={handleNavigate}
              onView={(v: any) => setView(v)}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onEventDrop={handleEventDrop}
              draggableAccessor={isDraggable}
              resizable={false}
              eventPropGetter={eventPropGetter}
              className="font-sans text-sm"
              components={{
                toolbar: CustomToolbar,
                month: { event: MonthEvent },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Confirmation dialog ────────────────────────────────────────────── */}
      <Dialog open={!!pendingMove} onOpenChange={(open) => !open && cancelMove()}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Reprogramar visita</DialogTitle>
          </DialogHeader>

          {pendingMove && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                ¿Confirmas el cambio de fecha para esta agenda?
              </p>

              {/* Event identity */}
              <div className="text-sm font-medium bg-slate-50 border rounded-md px-3 py-2 truncate">
                {pendingMove.event.title}
              </div>

              {/* Date change */}
              <div className="flex items-start gap-3 text-sm">
                <div className="flex-1 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  <p className="text-xs text-red-500 font-medium mb-0.5 uppercase tracking-wide">Fecha actual</p>
                  <p className="text-slate-700 capitalize">{fmtDateTime(pendingMove.event.start)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 mt-3 shrink-0" />
                <div className="flex-1 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                  <p className="text-xs text-green-600 font-medium mb-0.5 uppercase tracking-wide">Nueva fecha</p>
                  <p className="text-slate-700 capitalize">{fmtDateTime(pendingMove.newStart)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={cancelMove} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={confirmMove} disabled={saving}>
              {saving ? 'Guardando...' : 'Confirmar cambio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toast notification ─────────────────────────────────────────────── */}
      {toast && (
        <div className={`
          fixed bottom-6 right-6 z-[9999] flex items-center gap-2
          px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white
          transition-all duration-300 animate-in slide-in-from-bottom-2
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        `}>
          {toast.message}
        </div>
      )}
    </>
  )
}
