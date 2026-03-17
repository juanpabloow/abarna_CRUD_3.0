'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Button> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText, disabled, ...props }: Props) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || disabled} aria-disabled={pending} {...props}>
      {pending ? (pendingText ?? 'Guardando...') : children}
    </Button>
  )
}
