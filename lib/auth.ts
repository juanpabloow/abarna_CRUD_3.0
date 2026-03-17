export type UserRole = 'admin' | 'tecnico' | 'cliente'

export function getRoleRedirect(role: string): string {
  if (role === 'tecnico') return '/agendas'
  return '/'
}
