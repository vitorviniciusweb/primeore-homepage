'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import type { Contact, Temperature } from '../_types'

export type FilterState = {
  text: string
  nichos: string[]
  bairros: string[]
  temperatures: Temperature[]
  statusSite: string
  origens: string[]
}

export function emptyFilters(): FilterState {
  return {
    text: '',
    nichos: [],
    bairros: [],
    temperatures: [],
    statusSite: 'Todos',
    origens: [],
  }
}

export function applyFilters(contacts: Contact[], f: FilterState): Contact[] {
  return contacts.filter(c => {
    if (f.text) {
      const q = f.text.toLowerCase()
      const hay = `${c.name} ${c.company ?? ''} ${c.nicho ?? ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (f.nichos.length > 0 && (!c.nicho || !f.nichos.includes(c.nicho))) return false
    if (f.bairros.length > 0 && (!c.bairro || !f.bairros.includes(c.bairro))) return false
    if (f.temperatures.length > 0 && !f.temperatures.includes(c.temperature ?? 'morno')) return false
    if (f.statusSite !== 'Todos' && c.statusSite !== f.statusSite) return false
    if (f.origens.length > 0 && !f.origens.includes(c.channel)) return false
    return true
  })
}

function isActive(f: FilterState): boolean {
  return (
    f.text !== '' ||
    f.nichos.length > 0 ||
    f.bairros.length > 0 ||
    f.temperatures.length > 0 ||
    f.statusSite !== 'Todos' ||
    f.origens.length > 0
  )
}

const TEMP_CONFIG: { key: Temperature; label: string; activeColor: string }[] = [
  { key: 'quente', label: 'Quente', activeColor: '#ef4444' },
  { key: 'morno',  label: 'Morno',  activeColor: '#f59e0b' },
  { key: 'frio',   label: 'Frio',   activeColor: '#3D5A80' },
]

type Props = {
  contacts: Contact[]
  totalCount: number
  filteredCount: number
  value: FilterState
  onChange: (f: FilterState) => void
}

export function FilterBar({ contacts, totalCount, filteredCount, value, onChange }: Props) {
  const [nichoOpen, setNichoOpen] = useState(false)
  const [bairroOpen, setBairroOpen] = useState(false)
  const [origemOpen, setOrigemOpen] = useState(false)

  const nichos = [...new Set(contacts.map(c => c.nicho).filter(Boolean))] as string[]
  const bairros = [...new Set(contacts.map(c => c.bairro).filter(Boolean))] as string[]
  const origens = [...new Set(contacts.map(c => c.channel).filter(Boolean))] as string[]

  const active = isActive(value)

  function toggleTemp(t: Temperature) {
    const next = value.temperatures.includes(t)
      ? value.temperatures.filter(x => x !== t)
      : [...value.temperatures, t]
    onChange({ ...value, temperatures: next })
  }

  function toggleMulti(key: 'nichos' | 'bairros' | 'origens', val: string) {
    const arr = value[key] as string[]
    const next = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
    onChange({ ...value, [key]: next })
  }

  function closeAll() {
    setNichoOpen(false)
    setBairroOpen(false)
    setOrigemOpen(false)
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(242,240,235,0.07)', backgroundColor: '#1a1d24' }}
    >
      {/* Busca por texto */}
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#6b7280' }}
        />
        <input
          value={value.text}
          onChange={e => onChange({ ...value, text: e.target.value })}
          placeholder="Buscar por nome..."
          className="pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-none w-44"
          style={{
            backgroundColor: 'rgba(242,240,235,0.06)',
            borderColor: value.text ? '#FF6B35' : 'rgba(242,240,235,0.15)',
            color: '#F2F0EB',
          }}
        />
      </div>

      {/* Nicho multi-select */}
      {nichos.length > 0 && (
        <MultiSelect
          label="Nicho"
          options={nichos}
          selected={value.nichos}
          open={nichoOpen}
          onToggleOpen={() => {
            setNichoOpen(v => !v)
            setBairroOpen(false)
            setOrigemOpen(false)
          }}
          onToggle={val => toggleMulti('nichos', val)}
          onClose={() => setNichoOpen(false)}
        />
      )}

      {/* Bairro multi-select */}
      {bairros.length > 0 && (
        <MultiSelect
          label="Bairro"
          options={bairros}
          selected={value.bairros}
          open={bairroOpen}
          onToggleOpen={() => {
            setBairroOpen(v => !v)
            setNichoOpen(false)
            setOrigemOpen(false)
          }}
          onToggle={val => toggleMulti('bairros', val)}
          onClose={() => setBairroOpen(false)}
        />
      )}

      {/* Temperatura */}
      <div className="flex items-center gap-1">
        {TEMP_CONFIG.map(t => {
          const on = value.temperatures.includes(t.key)
          return (
            <button
              key={t.key}
              onClick={() => toggleTemp(t.key)}
              className="px-2 py-1 rounded text-[10px] font-medium border transition-colors"
              style={{
                backgroundColor: on ? t.activeColor : 'rgba(242,240,235,0.06)',
                borderColor: on ? t.activeColor : 'rgba(242,240,235,0.15)',
                color: on ? '#fff' : '#a8adb8',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Status do Site */}
      <select
        value={value.statusSite}
        onChange={e => onChange({ ...value, statusSite: e.target.value })}
        className="px-2 py-1.5 text-xs rounded-lg border outline-none"
        style={{
          backgroundColor: 'rgba(242,240,235,0.06)',
          borderColor: value.statusSite !== 'Todos' ? '#FF6B35' : 'rgba(242,240,235,0.15)',
          color: '#F2F0EB',
        }}
      >
        <option value="Todos" style={{ backgroundColor: '#1e222b' }}>
          Site: Todos
        </option>
        <option value="Sem site" style={{ backgroundColor: '#1e222b' }}>
          Sem site
        </option>
        <option value="Rede social/Link" style={{ backgroundColor: '#1e222b' }}>
          Rede social/Link
        </option>
      </select>

      {/* Origem multi-select */}
      {origens.length > 0 && (
        <MultiSelect
          label="Origem"
          options={origens}
          selected={value.origens}
          open={origemOpen}
          onToggleOpen={() => {
            setOrigemOpen(v => !v)
            setNichoOpen(false)
            setBairroOpen(false)
          }}
          onToggle={val => toggleMulti('origens', val)}
          onClose={() => setOrigemOpen(false)}
        />
      )}

      {/* Contador + limpar */}
      <div className="flex items-center gap-2 ml-auto">
        {active && (
          <>
            <span className="text-[10px]" style={{ color: '#6b7280' }}>
              {filteredCount} de {totalCount} contatos
            </span>
            <button
              onClick={() => { onChange(emptyFilters()); closeAll() }}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors hover:bg-white/10"
              style={{ color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
            >
              <X size={10} />
              Limpar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

type MultiSelectProps = {
  label: string
  options: string[]
  selected: string[]
  open: boolean
  onToggleOpen: () => void
  onToggle: (val: string) => void
  onClose: () => void
}

function MultiSelect({ label, options, selected, open, onToggleOpen, onToggle, onClose }: MultiSelectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasSelected = selected.length > 0

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggleOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors"
        style={{
          backgroundColor: hasSelected ? 'rgba(255,107,53,0.12)' : 'rgba(242,240,235,0.06)',
          borderColor: hasSelected ? '#FF6B35' : 'rgba(242,240,235,0.15)',
          color: hasSelected ? '#FF6B35' : '#a8adb8',
        }}
      >
        {label}
        {hasSelected && ` (${selected.length})`}
        <ChevronDown
          size={10}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-lg border py-1 min-w-[160px] max-h-52 overflow-y-auto"
          style={{
            backgroundColor: '#1e222b',
            borderColor: 'rgba(242,240,235,0.12)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {options.map(opt => {
            const checked = selected.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-white/5 transition-colors"
                style={{ color: checked ? '#FF6B35' : '#a8adb8' }}
              >
                <span
                  className="w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: checked ? '#FF6B35' : 'transparent',
                    borderColor: checked ? '#FF6B35' : 'rgba(242,240,235,0.25)',
                  }}
                >
                  {checked && (
                    <svg width="8" height="8" viewBox="0 0 8 8">
                      <path
                        d="M1 4l2 2 4-4"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="truncate">{opt}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
