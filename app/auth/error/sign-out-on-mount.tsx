'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Revokes any active Supabase session as soon as this page mounts.
 * This is the safety net: regardless of how a user arrived at /auth/error
 * (missing usuario row, expired invite, etc.), they are always signed out.
 * Once signed out, the middleware correctly blocks all protected routes.
 */
export function SignOutOnMount() {
  useEffect(() => {
    createClient().auth.signOut()
  }, [])
  return null
}
