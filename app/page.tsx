import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, MapPin, Droplet, Calendar as CalendarIcon, Wrench } from 'lucide-react'

export const revalidate = 0 // Disable cache for live dashboard

export default async function DashboardPage() {
  const supabase = await createClient()
  const [
    { count: clientesCount },
    { count: sedesCount },
    { count: instalacionesCount },
    { count: agendasPendientes },
    { data: proximasVisitas },
  ] = await Promise.all([
    supabase.from('clientes').select('*', { count: 'exact', head: true }),
    supabase.from('sedes').select('*', { count: 'exact', head: true }),
    supabase.from('instalaciones').select('*', { count: 'exact', head: true }),
    supabase.from('agendas').select('*', { count: 'exact', head: true }).eq('estatus', 'pendiente'),
    supabase.from('agendas')
      .select('*, instalaciones(codigo, sedes(nombre_sede, clientes(nombre_empresa)))')
      .in('estatus', ['pendiente', 'programada'])
      .order('fecha_visita', { ascending: true })
      .limit(5)
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard General</h2>
        <p className="text-muted-foreground mt-1">Resumen operativo de la compañía.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Empresas y naturales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sedes</CardTitle>
            <MapPin className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sedesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Ubicaciones activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instalaciones</CardTitle>
            <Droplet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instalacionesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Tanques registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendas Pendientes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendasPendientes || 0}</div>
            <p className="text-xs text-muted-foreground">Por programar o ejecutar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximas Visitas</CardTitle>
            <CardDescription>Agendas programadas para los próximos días.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasVisitas?.length ? proximasVisitas.map((agenda) => (
                <div key={agenda.agenda_id} className="flex items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="h-10 w-10 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{agenda.tipo_servicio}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(agenda.fecha_visita).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(agenda as any).instalaciones?.sedes?.clientes?.nombre_empresa}</p>
                    <p className="text-xs text-muted-foreground">{(agenda as any).instalaciones?.codigo} - {(agenda as any).instalaciones?.sedes?.nombre_sede}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No hay visitas programadas próximamente.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
