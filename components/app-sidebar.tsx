import {
  LayoutDashboard,
  Users,
  Briefcase,
  MapPin,
  Droplet,
  Calendar,
  ListFilter,
  Map as MapIcon
} from 'lucide-react'
import Link from 'next/link'

const mainNavItems = [
  { name: 'Dashboard', url: '/', icon: LayoutDashboard },
  { name: 'Usuarios', url: '/usuarios', icon: Users },
  { name: 'Clientes', url: '/clientes', icon: Briefcase },
  { name: 'Sedes', url: '/sedes', icon: MapPin },
  { name: 'Instalaciones', url: '/instalaciones', icon: Droplet },
  { name: 'Agendas', url: '/agendas', icon: Calendar },
]

const configNavItems = [
  { name: 'Fuentes', url: '/fuentes', icon: ListFilter },
  { name: 'Ciudades', url: '/ciudades', icon: MapIcon },
]

export function AppSidebar() {
  return (
    <aside className="w-64 shrink-0 flex flex-col border-r bg-slate-100 overflow-y-auto">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Abarna Admin
        </h2>
      </div>
      <div className="p-4 flex-1 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Principal
          </h3>
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Configuración
          </h3>
          <ul className="space-y-1">
            {configNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
