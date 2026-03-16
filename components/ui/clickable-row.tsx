'use client'

import { TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export function ClickableRow({ 
  children, 
  href, 
  ...props 
}: React.ComponentProps<typeof TableRow> & { href: string }) {
  const router = useRouter()

  return (
    <TableRow 
      className="cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => router.push(href, { scroll: false })}
      {...props}
    >
      {children}
    </TableRow>
  )
}
