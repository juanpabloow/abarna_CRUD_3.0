import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { SignOutOnMount } from './sign-out-on-mount'

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams
  const isExpiredInvite = reason === 'invite_expired'

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {/* Unconditionally revoke the session — an unlinked user must never access the app */}
      <SignOutOnMount />
      <Card className="w-full max-w-sm shadow-md text-center">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <CardTitle className="text-lg">
            {isExpiredInvite ? 'Invitación inválida' : 'Acceso no autorizado'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {isExpiredInvite
              ? 'El enlace de invitación ha expirado o ya fue utilizado. Solicita al administrador que envíe una nueva invitación.'
              : 'Tu cuenta fue autenticada, pero no está asociada a un usuario autorizado del sistema. Contacta al administrador.'}
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
