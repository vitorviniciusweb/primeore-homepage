'use client'

import { useState, useEffect } from 'react'
import { Bell, Phone, Calendar, MessageCircle, Trash2, Plus, X } from 'lucide-react'
import type { Activity, Contact } from '../_types'
import { Button } from '@/components/ui/button'

type Props = {
  contactId: string
}

type ActivityType = Activity['type']

const TYPE_CONFIG: Record<ActivityType, { label: string; Icon: React.ElementType; color: string }> = {
  lembrete: { label: 'Lembrete',  Icon: Bell,           color: '#f59e0b' },
  ligacao:  { label: 'Ligação',   Icon: Phone,          color: '#22c55e' },
  reuniao:  { label: 'Reunião',   Icon: Calendar,       color: '#3D5A80' },
  mensagem: { label: 'Mensagem',  Icon: MessageCircle,  color: '#a855f7' },
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function nextHourISO(): string {
  const d = new Date()
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d.toISOString().slice(0, 16)
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const textareaStyle: React.CSSProperties = {
  backgroundColor: 'rgba(242,240,235,0.06)',
  color: '#F2F0EB',
  borderColor: 'rgba(242,240,235,0.15)',
}

const selectStyle: React.CSSProperties = {
  backgroundColor: 'rgba(242,240,235,0.06)',
  color: '#F2F0EB',
  borderColor: 'rgba(242,240,235,0.15)',
  outline: 'none',
}

export function ActivitySection({ contactId }: Props) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formType, setFormType] = useState<ActivityType>('lembrete')
  const [formScheduledFor, setFormScheduledFor] = useState(nextHourISO())
  const [formNote, setFormNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/activities/${contactId}`)
      .then(r => r.json())
      .then((data: Activity[]) => {
        if (!cancelled) {
          setActivities(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [contactId])

  async function handleSave() {
    if (!formScheduledFor) return
    setSaving(true)
    const activity: Activity = {
      id: uid(),
      contactId,
      type: formType,
      scheduledFor: new Date(formScheduledFor).toISOString(),
      note: formNote.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    try {
      await fetch(`/api/activities/${contactId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      })
      setActivities(prev => [activity, ...prev])
      setShowForm(false)
      setFormType('lembrete')
      setFormScheduledFor(nextHourISO())
      setFormNote('')
      // Fire and forget: atualiza lastContact do contato com a data de hoje
      ;(async () => {
        try {
          const res = await fetch('/api/contacts')
          if (!res.ok) return
          const all = (await res.json()) as Contact[]
          if (!Array.isArray(all)) return
          const today = new Date().toISOString().split('T')[0]
          const updated = all.map(c =>
            c.id === contactId ? { ...c, lastContact: today } : c,
          )
          await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          })
        } catch {}
      })()
    } finally {
      setSaving(false)
    }
  }

  async function toggleCompleted(id: string, completed: boolean) {
    setActivities(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, completed, completedAt: completed ? new Date().toISOString() : undefined }
          : a,
      ),
    )
    await fetch(`/api/activities/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    }).catch(() => {
      // revert on error
      setActivities(prev =>
        prev.map(a => (a.id === id ? { ...a, completed: !completed, completedAt: undefined } : a)),
      )
    })
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Excluir esta atividade?')) return
    setActivities(prev => prev.filter(a => a.id !== id))
    await fetch(`/api/activities/${contactId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  const pending = activities.filter(a => !a.completed)
  const nextActivity = pending.length > 0
    ? [...pending].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))[0]
    : null

  const sorted = [...activities].sort((a, b) => b.scheduledFor.localeCompare(a.scheduledFor))

  if (loading) {
    return (
      <div className="py-8 text-center text-xs" style={{ color: '#6b7280' }}>
        Carregando atividades...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
            Atividades
          </span>
          {pending.length > 0 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
            >
              {pending.length} {pending.length === 1 ? 'pendente' : 'pendentes'}
            </span>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setFormScheduledFor(nextHourISO()) }}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
          >
            <Plus size={11} />
            Nova atividade
          </button>
        )}
      </div>

      {/* Próxima atividade */}
      {nextActivity && !showForm && (
        <NextActivityCard activity={nextActivity} />
      )}

      {/* Mini-form */}
      {showForm && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ backgroundColor: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.1)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: '#a8adb8' }}>
              Nova atividade
            </span>
            <button
              onClick={() => setShowForm(false)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X size={12} style={{ color: '#6b7280' }} />
            </button>
          </div>

          {/* Tipo */}
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.entries(TYPE_CONFIG) as [ActivityType, typeof TYPE_CONFIG[ActivityType]][]).map(([key, cfg]) => {
              const active = formType === key
              return (
                <button
                  key={key}
                  onClick={() => setFormType(key)}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-medium transition-colors border"
                  style={{
                    backgroundColor: active ? `${cfg.color}20` : 'rgba(242,240,235,0.04)',
                    borderColor: active ? cfg.color : 'rgba(242,240,235,0.1)',
                    color: active ? cfg.color : '#6b7280',
                  }}
                >
                  <cfg.Icon size={13} />
                  {cfg.label}
                </button>
              )
            })}
          </div>

          {/* Data/hora */}
          <input
            type="datetime-local"
            value={formScheduledFor}
            onChange={e => setFormScheduledFor(e.target.value)}
            className="flex h-9 w-full rounded-lg border px-3 text-xs"
            style={selectStyle}
          />

          {/* Nota */}
          <textarea
            value={formNote}
            onChange={e => setFormNote(e.target.value)}
            rows={2}
            placeholder="O que precisa ser feito ou foi tratado?"
            className="flex w-full rounded-lg border px-3 py-2 text-xs resize-none focus:outline-none"
            style={textareaStyle}
          />

          <Button
            size="sm"
            className="w-full text-xs"
            disabled={!formScheduledFor || saving}
            style={{ backgroundColor: '#FF6B35', color: '#fff' }}
            onClick={handleSave}
          >
            {saving ? 'Salvando...' : 'Salvar atividade'}
          </Button>
        </div>
      )}

      {/* Lista */}
      {sorted.length === 0 && !showForm && (
        <div
          className="rounded-lg py-8 text-center text-xs"
          style={{ color: '#6b7280', border: '1px dashed rgba(242,240,235,0.1)' }}
        >
          Nenhuma atividade registrada
        </div>
      )}

      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(a => (
            <ActivityItem
              key={a.id}
              activity={a}
              onToggle={toggleCompleted}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NextActivityCard({ activity }: { activity: Activity }) {
  const cfg = TYPE_CONFIG[activity.type]
  const isOverdue = new Date(activity.scheduledFor) < new Date()

  return (
    <div
      className="rounded-lg p-3 space-y-1"
      style={{
        backgroundColor: 'rgba(61,90,128,0.12)',
        border: '1px solid rgba(61,90,128,0.3)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#3D5A80' }}>
          Próxima atividade
        </span>
      </div>
      <div className="flex items-start gap-2">
        <cfg.Icon size={14} style={{ color: cfg.color, marginTop: 1, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium" style={{ color: '#F2F0EB' }}>
              {formatDateTime(activity.scheduledFor)}
            </span>
            {isOverdue && (
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
              >
                Atrasado
              </span>
            )}
          </div>
          {activity.note && (
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#a8adb8' }}>
              {activity.note}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function ActivityItem({
  activity,
  onToggle,
  onDelete,
}: {
  activity: Activity
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  const cfg = TYPE_CONFIG[activity.type]
  const isOverdue = !activity.completed && new Date(activity.scheduledFor) < new Date()

  return (
    <div
      className="flex items-start gap-2.5 rounded-lg p-2.5 group transition-colors"
      style={{
        backgroundColor: 'rgba(242,240,235,0.03)',
        border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.25)' : 'rgba(242,240,235,0.07)'}`,
        opacity: activity.completed ? 0.55 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(activity.id, !activity.completed)}
        className="mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: activity.completed ? '#22c55e' : 'transparent',
          borderColor: activity.completed ? '#22c55e' : 'rgba(242,240,235,0.25)',
        }}
      >
        {activity.completed && (
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Icon */}
      <cfg.Icon size={13} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-medium"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>
          <span className="text-[10px]" style={{ color: '#6b7280' }}>
            {formatDateTime(activity.scheduledFor)}
          </span>
          {isOverdue && (
            <span
              className="text-[9px] font-semibold px-1 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >
              Atrasado
            </span>
          )}
        </div>
        {activity.note && (
          <p
            className="text-xs mt-0.5"
            style={{
              color: '#a8adb8',
              textDecoration: activity.completed ? 'line-through' : 'none',
            }}
          >
            {activity.note}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(activity.id)}
        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 shrink-0"
      >
        <Trash2 size={11} style={{ color: '#6b7280' }} />
      </button>
    </div>
  )
}
