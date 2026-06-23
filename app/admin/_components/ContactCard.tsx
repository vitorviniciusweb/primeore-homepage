'use client'

import { Pencil, Trash2, Phone, MessageCircle } from 'lucide-react'
import type { Contact, Temperature } from '../_types'

type Props = {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}

const TEMP_CONFIG: Record<
  Temperature,
  { label: string; color: string; icon: string }
> = {
  quente: { label: 'Quente', color: '#ef4444', icon: '🔥' },
  morno:  { label: 'Morno',  color: '#f59e0b', icon: '●' },
  frio:   { label: 'Frio',   color: '#3D5A80', icon: '●' },
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function ContactCard({ contact, onEdit, onDelete }: Props) {
  const temp = TEMP_CONFIG[contact.temperature ?? 'morno']
  const digits = contact.phone ? phoneDigits(contact.phone) : ''
  const hasPhone = digits.length >= 10

  return (
    <div
      className="rounded-lg border p-3 space-y-2 cursor-pointer group hover:border-white/20 transition-colors"
      style={{ backgroundColor: '#1e222b', borderColor: 'rgba(242,240,235,0.08)' }}
      onClick={onEdit}
    >
      {/* Row 1: name + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-snug truncate" style={{ color: '#F2F0EB' }}>
            {contact.name}
          </p>
          <p className="text-xs mt-0.5 leading-snug truncate" style={{ color: '#a8adb8' }}>
            {contact.company}
          </p>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit() }}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
          >
            <Pencil size={11} style={{ color: '#a8adb8' }} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={11} style={{ color: '#a8adb8' }} />
          </button>
        </div>
      </div>

      {/* Row 2: temperature */}
      <div className="flex items-center gap-1">
        <span className="text-[11px] leading-none" style={{ color: temp.color }}>
          {temp.icon}
        </span>
        <span className="text-[10px] font-medium" style={{ color: temp.color }}>
          {temp.label}
        </span>
      </div>

      {/* Row 3: channel badge + quick actions */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium truncate"
          style={{ backgroundColor: 'rgba(61,90,128,0.35)', color: '#c8d0dc', maxWidth: '60%' }}
        >
          {contact.channel}
        </span>

        {hasPhone && (
          <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
            <a
              href={`tel:+55${digits}`}
              title="Ligar"
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <Phone size={11} style={{ color: '#a8adb8' }} />
            </a>
            <a
              href={`https://wa.me/55${digits}`}
              target="_blank"
              rel="noreferrer"
              title="WhatsApp"
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <MessageCircle size={11} style={{ color: '#a8adb8' }} />
            </a>
          </div>
        )}
      </div>

      {/* Row 4: last contact date */}
      <p className="text-[10px]" style={{ color: '#6b7280' }}>
        Último contato: {formatDate(contact.lastContact)}
      </p>

      {contact.lostReason && (
        <p className="text-[10px] italic line-clamp-2" style={{ color: '#9ca3af' }}>
          Motivo: {contact.lostReason}
        </p>
      )}
    </div>
  )
}
