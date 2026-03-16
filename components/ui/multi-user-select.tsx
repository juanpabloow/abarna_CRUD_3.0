'use client'

import React, { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { searchUsuarios } from '@/app/actions/user-search'

type UsuarioOption = {
  usuario_id: string
  nombre_completo: string
  email: string | null
}

export function MultiUserSelect({
  roleFilter,
  initialSelected = [],
  fieldName = 'assigned_users'
}: {
  roleFilter?: string
  initialSelected?: UsuarioOption[]
  fieldName?: string
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<UsuarioOption[]>(initialSelected)
  const [options, setOptions] = useState<UsuarioOption[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true)
      const res = await searchUsuarios('', roleFilter)
      setOptions(res)
      setLoading(false)
    }
    fetchInitial()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!search && options.length > 0) return
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true)
      const results = await searchUsuarios(search, roleFilter)
      setOptions(results)
      setLoading(false)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, roleFilter])

  const toggleSelect = (user: UsuarioOption) => {
    const isSelected = selected.some(s => s.usuario_id === user.usuario_id)
    if (isSelected) {
      setSelected(selected.filter(s => s.usuario_id !== user.usuario_id))
    } else {
      setSelected([...selected, user])
    }
  }

  const removeSelect = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelected(selected.filter(s => s.usuario_id !== userId))
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {selected.map(s => (
        <input key={s.usuario_id} type="hidden" name={fieldName} value={s.usuario_id} />
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm h-auto min-h-10 flex-wrap gap-1 cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          {selected.length === 0 && <span className="text-muted-foreground mr-auto text-sm font-normal">Seleccionar usuarios...</span>}
          {selected.map((user) => (
            <Badge variant="secondary" key={user.usuario_id} className="mr-1 mb-1 shadow-sm border font-normal flex items-center gap-1 z-10">
              {user.nombre_completo.split(' ')[0]}
              <div
                role="button"
                onClick={(e) => removeSelect(user.usuario_id, e)}
                className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </div>
            </Badge>
          ))}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Buscar por nombre, email o cédula..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{loading ? 'Buscando...' : 'No se encontraron resultados.'}</CommandEmpty>
              <CommandGroup>
                {options.map((user) => {
                  const isSelected = selected.some(s => s.usuario_id === user.usuario_id)
                  return (
                    <CommandItem
                      key={user.usuario_id}
                      value={user.usuario_id}
                      onSelect={() => toggleSelect(user)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span>{user.nombre_completo}</span>
                        <span className="text-xs text-muted-foreground">{user.email || 'Sin email'}</span>
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
