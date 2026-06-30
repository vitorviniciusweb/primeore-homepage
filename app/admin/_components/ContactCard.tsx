'use client'

import { Pencil, Trash2, Phone, MessageCircle, ClipboardCopy, Eye, Users, Camera, Video, Briefcase, Music2, Globe } from 'lucide-react'
import type { Contact, Temperature } from '../_types'

type Props = {
  contact: Contact
  onEdit: () => void
  onDelete: () => void
  briefingPreenchido?: boolean
  onViewBriefing?: () => void
  onCopyBriefingLink?: () => void
  nextActivity?: { scheduledFor: string; overdue: boolean }
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

function formatActivityDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrowMidnight = new Date(todayMidnight.getTime() + 86400000)
  const targetMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const hhmm = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(d)

  if (targetMidnight.getTime() === todayMidnight.getTime()) return `Hoje ${hhmm}`
  if (targetMidnight.getTime() === tomorrowMidnight.getTime()) return `Amanhã ${hhmm}`

  const day = String(d.getDate()).padStart(2, '0')
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${day}/${months[d.getMonth()]} ${hhmm}`
}

function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

function SocialIcon({ platform }: { platform: string }) {
  const size = 10
  switch (platform.toLowerCase()) {
    case 'facebook':  return <Users     size={size} />
    case 'instagram': return <Camera    size={size} />
    case 'youtube':   return <Video     size={size} />
    case 'linkedin':  return <Briefcase size={size} />
    case 'spotify':   return <Music2    size={size} />
    default:          return <Globe     size={size} />
  }
}

function servicesLabel(services: string[]): string {
  if (services.length === 0) return ''
  if (services.length <= 2) return services.join(', ')
  return `${services[0]} e mais ${services.length - 1}`
}

function ActivityBadge({ nextActivity }: { nextActivity: { scheduledFor: string; overdue: boolean } }) {
  const hoursUntil = (new Date(nextActivity.scheduledFor).getTime() - Date.now()) / 3600000
  const label = formatActivityDate(nextActivity.scheduledFor)

  let bg: string, color: string, text: string
  if (nextActivity.overdue) {
    bg = 'rgba(239,68,68,0.15)'
    color = '#ef4444'
    text = `⚠ Atrasado · ${label}`
  } else if (hoursUntil <= 48) {
    bg = 'rgba(255,107,53,0.15)'
    color = '#FF6B35'
    text = `🔔 ${label}`
  } else {
    bg = 'rgba(42,48,60,0.8)'
    color = '#6b7280'
    text = `📅 ${label}`
  }

  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium w-full"
      style={{ backgroundColor: bg, color }}
    >
      {text}
    </span>
  )
}

export function ContactCard({
  contact, onEdit, onDelete,
  briefingPreenchido, onViewBriefing, onCopyBriefingLink,
  nextActivity,
}: Props) {
  const temp = TEMP_CONFIG[contact.temperature ?? 'morno']
  const digits = contact.phone ? phoneDigits(contact.phone) : ''
  const hasPhone = digits.length >= 10
  const filledSocials = (contact.socialMedia ?? []).filter(s => s.url)
  const svcLabel = servicesLabel(contact.services ?? [])

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
          {contact.company && (
            <p className="text-xs mt-0.5 leading-snug truncate" style={{ color: '#a8adb8' }}>
              {contact.company}
            </p>
          )}
          {contact.nicho && (
            <span
              className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{ backgroundColor: 'rgba(255,107,53,0.1)', color: '#FF6B35' }}
            >
              {contact.nicho}
            </span>
          )}
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
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] leading-none" style={{ color: temp.color }}>
          {temp.icon}
        </span>
        <span className="text-[10px] font-medium" style={{ color: temp.color }}>
          {temp.label}
        </span>
        {contact.bairro && (
          <span
            className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium"
            style={{ backgroundColor: 'rgba(61,90,128,0.2)', color: '#7a9abf' }}
          >
            {contact.bairro}
          </span>
        )}
      </div>

      {/* Row 2b: services */}
      {svcLabel && (
        <p className="text-[10px] leading-snug" style={{ color: '#a8adb8' }}>
          {svcLabel}
        </p>
      )}

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

      {/* Activity badge */}
      {nextActivity && (
        <div onClick={e => e.stopPropagation()}>
          <ActivityBadge nextActivity={nextActivity} />
        </div>
      )}

      {/* Social media icons */}
      {filledSocials.length > 0 && (
        <div className="flex items-center gap-0.5 flex-wrap" onClick={e => e.stopPropagation()}>
          {filledSocials.map((s, i) => (
            <a
              key={`${s.platform}-${i}`}
              href={s.url.startsWith('http') ? s.url : `https://${s.url}`}
              target="_blank"
              rel="noreferrer"
              title={s.platform}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: '#6b7280' }}
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
      )}

      {/* Row 4: last contact date */}
      <p className="text-[10px]" style={{ color: '#6b7280' }}>
        {contact.lastContact
          ? `Último contato: ${formatDate(contact.lastContact)}`
          : 'Sem contato ainda'}
      </p>

      {contact.lostReason && (
        <p className="text-[10px] italic line-clamp-2" style={{ color: '#9ca3af' }}>
          Motivo: {contact.lostReason}
        </p>
      )}

      {/* Briefing section — only for "Fechado" */}
      {contact.status === 'Fechado' && (
        <div
          className="pt-2"
          style={{ borderTop: '1px solid rgba(242,240,235,0.07)' }}
          onClick={e => e.stopPropagation()}
        >
          {briefingPreenchido ? (
            <div className="flex items-center justify-between gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
              >
                Briefing ✓
              </span>
              <button
                onClick={onViewBriefing}
                className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded transition-colors hover:bg-white/10"
                style={{ color: '#a8adb8' }}
              >
                <Eye size={9} />
                Ver
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
                style={{ backgroundColor: 'rgba(107,114,128,0.15)', color: '#6b7280' }}
              >
                Briefing pendente
              </span>
              <button
                onClick={onCopyBriefingLink}
                className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded transition-colors hover:bg-white/10"
                style={{ color: '#a8adb8' }}
              >
                <ClipboardCopy size={9} />
                Copiar link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
