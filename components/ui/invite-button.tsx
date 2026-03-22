'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface InviteButtonProps {
  usuarioId: string
  nombreCompleto: string
}

export function InviteButton({ usuarioId, nombreCompleto }: InviteButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleInvite() {
    setStatus('loading')
    setErrorMsg(null)

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Error desconocido.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('No se pudo conectar con el servidor.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Invitación enviada
      </span>
    )
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        onClick={handleInvite}
        disabled={status === 'loading'}
        title={`Enviar invitación a ${nombreCompleto}`}
      >
        {status === 'loading' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
        ) : (
          <Mail className="h-3.5 w-3.5 mr-1" />
        )}
        {status === 'loading' ? 'Enviando...' : 'Invitar'}
      </Button>
      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-600 max-w-[200px] leading-snug">{errorMsg}</p>
      )}
    </div>
  )
}
