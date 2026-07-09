'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Dialog } from '@base-ui/react/dialog'
import {
  ArrowLeft, ChevronLeft, ChevronRight, ChevronDown, Trash2, Pencil, Flag, X, Share2, ExternalLink, Plus,
} from 'lucide-react'
import type { Activity, Contact, ActivityWithContact, ProjectStatus } from '../_types'
import {
  ACTIVITY_TYPE_CONFIG,
  activityStatus,
  STATUS_BADGE_CONFIG,
  formatTime,
  formatDateTime,
  truncate,
  isSameDay,
  getWeekDays,
  toDatetimeLocalInput,
  type ActivityType,
} from '../_activity-utils'
import { MeetingShareModal } from '../_components/MeetingShareModal'
import { Button } from '@/components/ui/button'

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function nextHourISO(): string {
  const d = new Date()
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d.toISOString().slice(0, 16)
}

type MainTab = 'semana' | 'lista' | 'projetos'
type ListFilter = 'todas' | 'pendentes' | 'atrasadas' | 'concluidas'
type GroupKey = 'hoje' | 'amanha' | 'semana' | 'proximas' | 'passadas'

const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: 'semana', label: 'Semana' },
  { key: 'lista', label: 'Lista' },
  { key: 'projetos', label: 'Projetos' },
]

const LIST_FILTERS: { key: ListFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'atrasadas', label: 'Atrasadas' },
  { key: 'concluidas', label: 'Concluídas' },
]

const GROUP_LABELS: Record<GroupKey, string> = {
  hoje: 'Hoje',
  amanha: 'Amanhã',
  semana: 'Esta semana',
  proximas: 'Próximas semanas',
  passadas: 'Passadas',
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const PROJECT_STATUS_COLOR: Record<ProjectStatus['status'], string> = {
  'Em andamento': '#3D5A80',
  'Aguardando cliente': '#f59e0b',
  'Entregue': '#22c55e',
}

const selectStyle: React.CSSProperties = {
  backgroundColor: 'rgba(242,240,235,0.06)',
  color: '#F2F0EB',
  borderColor: 'rgba(242,240,235,0.15)',
  outline: 'none',
}

const textareaStyle: React.CSSProperties = {
  backgroundColor: 'rgba(242,240,235,0.06)',
  color: '#F2F0EB',
  borderColor: 'rgba(242,240,235,0.15)',
}

function formatRange(start: Date, end: Date): string {
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${fmt(start)} — ${fmt(end)}`
}

function formatShortDate(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return iso
  }
}

function todayISODate(): string {
  return new Date().toISOString().split('T')[0]
}

function matchesFilter(a: ActivityWithContact, filter: ListFilter): boolean {
  if (filter === 'todas') return true
  const status = activityStatus(a)
  if (filter === 'pendentes') return status === 'pendente'
  if (filter === 'atrasadas') return status === 'atrasado'
  return status === 'concluido'
}

function dateGroupKey(iso: string): GroupKey {
  const d = new Date(iso)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((dayStart.getTime() - todayStart.getTime()) / 86400000)
  if (diffDays < 0) return 'passadas'
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'amanha'
  const sunday = getWeekDays(0)[6]
  const sundayStart = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate())
  if (dayStart.getTime() <= sundayStart.getTime()) return 'semana'
  return 'proximas'
}

function groupByDate(items: ActivityWithContact[]): { key: GroupKey; label: string; items: ActivityWithContact[] }[] {
  const order: GroupKey[] = ['hoje', 'amanha', 'semana', 'proximas', 'passadas']
  const buckets: Record<GroupKey, ActivityWithContact[]> = {
    hoje: [], amanha: [], semana: [], proximas: [], passadas: [],
  }
  for (const a of items) buckets[dateGroupKey(a.scheduledFor)].push(a)
  for (const k of order) buckets[k].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
  return order.map(k => ({ key: k, label: GROUP_LABELS[k], items: buckets[k] }))
}

function daysRemainingLabel(deadlineIso: string): { text: string; overdue: boolean } {
  const deadline = new Date(`${deadlineIso}T00:00:00`)
  const today = new Date()
  const deadlineStart = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diff = Math.round((deadlineStart.getTime() - todayStart.getTime()) / 86400000)
  if (diff < 0) return { text: `${Math.abs(diff)} dias em atraso`, overdue: true }
  if (diff === 0) return { text: 'Entrega hoje', overdue: false }
  return { text: `${diff} dias restantes`, overdue: false }
}

function projectsForDay(contacts: Contact[], day: Date): Contact[] {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  return contacts.filter(c => {
    if (c.status !== 'Fechado' || !c.projectStatus) return false
    const deadline = new Date(`${c.projectStatus.deadline}T00:00:00`)
    if (!isSameDay(deadline, day)) return false
    if (c.projectStatus.status === 'Entregue' && deadline < todayStart) return false
    return true
  })
}

export default function AgendaPage() {
  const [activities, setActivities] = useState<ActivityWithContact[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [mainTab, setMainTab] = useState<MainTab>('semana')
  const [weekOffset, setWeekOffset] = useState(0)
  const [listFilter, setListFilter] = useState<ListFilter>('todas')
  const [shareTarget, setShareTarget] = useState<ActivityWithContact | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editingActivity, setEditingActivity] = useState<ActivityWithContact | null>(null)
  const [taskCountMap, setTaskCountMap] = useState<Record<string, number>>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/activities/all').then(r => (r.ok ? r.json() : [])),
      fetch('/api/contacts').then(r => (r.ok ? r.json() : [])),
    ])
      .then(([acts, cts]) => {
        const allActivities: ActivityWithContact[] = Array.isArray(acts) ? acts : []
        setActivities(allActivities)
        setContacts(Array.isArray(cts) ? cts : [])

        const taskCounts: Record<string, number> = {}
        allActivities.forEach(a => {
          if (a.type === 'tarefa') {
            taskCounts[a.contactId] = (taskCounts[a.contactId] || 0) + 1
          }
        })
        setTaskCountMap(taskCounts)

        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function setProjectTaskCount(contactId: string, count: number) {
    setTaskCountMap(prev => ({ ...prev, [contactId]: count }))
  }

  function incrementProjectTaskCount(contactId: string) {
    setTaskCountMap(prev => ({ ...prev, [contactId]: (prev[contactId] ?? 0) + 1 }))
  }

  function decrementProjectTaskCount(contactId: string) {
    setTaskCountMap(prev => ({ ...prev, [contactId]: Math.max(0, (prev[contactId] ?? 0) - 1) }))
  }

  async function toggleCompleted(a: ActivityWithContact, completed: boolean) {
    setActivities(prev =>
      prev.map(x =>
        x.id === a.id
          ? { ...x, completed, completedAt: completed ? new Date().toISOString() : undefined }
          : x,
      ),
    )
    await fetch(`/api/activities/${a.contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id, completed }),
    }).catch(() => {})
  }

  async function deleteActivity(a: ActivityWithContact) {
    if (!window.confirm('Excluir esta atividade?')) return
    setActivities(prev => prev.filter(x => x.id !== a.id))
    await fetch(`/api/activities/${a.contactId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id }),
    }).catch(() => {})
  }

  async function updateActivity(
    id: string,
    contactId: string,
    patch: { type: ActivityType; scheduledFor: string; note: string; meetingLink: string | null },
  ) {
    setActivities(prev =>
      prev.map(x =>
        x.id === id
          ? { ...x, type: patch.type, scheduledFor: patch.scheduledFor, note: patch.note, meetingLink: patch.meetingLink ?? undefined }
          : x,
      ),
    )
    setEditingActivity(null)
    await fetch(`/api/activities/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    }).catch(() => {})
  }

  async function saveProjectStatus(contactId: string, ps: ProjectStatus) {
    const updated = contacts.map(c => (c.id === contactId ? { ...c, projectStatus: ps } : c))
    setContacts(updated)
    setEditingContact(null)
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {})
  }

  const shareContact = shareTarget ? contacts.find(c => c.id === shareTarget.contactId) : undefined

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#16191F' }}>
      {/* Header */}
      <header
        className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(242,240,235,0.07)', backgroundColor: '#1a1d24' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
            style={{ color: '#a8adb8' }}
          >
            <ArrowLeft size={13} />
            Voltar ao Pipeline
          </Link>
          <span style={{ color: 'rgba(242,240,235,0.2)' }}>·</span>
          <span className="font-semibold text-sm" style={{ color: '#F2F0EB' }}>
            Agenda
          </span>
        </div>
      </header>

      {/* Main tabs */}
      <div
        className="flex px-4 sm:px-5"
        style={{ borderBottom: '1px solid rgba(242,240,235,0.07)', backgroundColor: '#1a1d24' }}
      >
        {MAIN_TABS.map(t => {
          const active = mainTab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setMainTab(t.key)}
              className="px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                color: active ? '#FF6B35' : '#6b7280',
                borderBottom: active ? '2px solid #FF6B35' : '2px solid transparent',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="text-sm" style={{ color: '#a8adb8' }}>Carregando agenda...</span>
        </div>
      ) : (
        <>
          {mainTab === 'semana' && (
            <SemanaTab
              activities={activities}
              contacts={contacts}
              weekOffset={weekOffset}
              setWeekOffset={setWeekOffset}
              onShare={setShareTarget}
              onEdit={setEditingActivity}
            />
          )}
          {mainTab === 'lista' && (
            <ListaTab
              activities={activities}
              listFilter={listFilter}
              setListFilter={setListFilter}
              onToggle={toggleCompleted}
              onDelete={deleteActivity}
              onShare={setShareTarget}
              onEdit={setEditingActivity}
            />
          )}
          {mainTab === 'projetos' && (
            <ProjetosTab
              contacts={contacts}
              taskCountMap={taskCountMap}
              onEdit={setEditingContact}
              onTaskCountLoaded={setProjectTaskCount}
              onTaskAdded={incrementProjectTaskCount}
              onTaskDeleted={decrementProjectTaskCount}
            />
          )}
        </>
      )}

      <MeetingShareModal
        open={!!shareTarget}
        onClose={() => setShareTarget(null)}
        contactName={shareTarget?.contactName ?? ''}
        contactPhone={shareContact?.phone}
        scheduledFor={shareTarget?.scheduledFor ?? ''}
        meetingLink={shareTarget?.meetingLink ?? ''}
      />

      <ProjectEditModal
        contact={editingContact}
        open={!!editingContact}
        onClose={() => setEditingContact(null)}
        onSave={saveProjectStatus}
      />

      <ActivityEditModal
        activity={editingActivity}
        open={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        onSave={updateActivity}
      />
    </div>
  )
}

// ── Aba: Semana ─────────────────────────────────────────────────────────

function SemanaTab({
  activities,
  contacts,
  weekOffset,
  setWeekOffset,
  onShare,
  onEdit,
}: {
  activities: ActivityWithContact[]
  contacts: Contact[]
  weekOffset: number
  setWeekOffset: (fn: (w: number) => number) => void
  onShare: (a: ActivityWithContact) => void
  onEdit: (a: ActivityWithContact) => void
}) {
  const weekDays = getWeekDays(weekOffset)
  const today = new Date()

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          className="p-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: '#a8adb8' }}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium min-w-[100px] text-center" style={{ color: '#F2F0EB' }}>
          {formatRange(weekDays[0], weekDays[6])}
        </span>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: '#a8adb8' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {weekDays.map(day => {
          const dayActivities = activities
            .filter(a => isSameDay(new Date(a.scheduledFor), day))
            .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
          const dayProjects = projectsForDay(contacts, day)
          const isToday = isSameDay(day, today)

          return (
            <div
              key={day.toISOString()}
              className="rounded-lg p-3 space-y-2 min-h-[140px]"
              style={{
                backgroundColor: '#1e222b',
                border: isToday ? '2px solid #FF6B35' : '1px solid rgba(242,240,235,0.08)',
              }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: isToday ? '#FF6B35' : '#a8adb8' }}
                >
                  {WEEKDAY_LABELS[day.getDay()]}
                </span>
                <span className="text-[10px]" style={{ color: '#6b7280' }}>
                  {String(day.getDate()).padStart(2, '0')}/{String(day.getMonth() + 1).padStart(2, '0')}
                </span>
              </div>

              {dayActivities.length === 0 && dayProjects.length === 0 ? (
                <p className="text-[11px]" style={{ color: '#6b7280' }}>Sem atividades</p>
              ) : (
                <>
                  {dayActivities.length > 0 && (
                    <div className="space-y-1.5">
                      {dayActivities.map(a => (
                        <WeekActivityRow key={a.id} activity={a} onShare={onShare} onEdit={onEdit} />
                      ))}
                    </div>
                  )}
                  {dayProjects.length > 0 && (
                    <div className="space-y-1.5">
                      {dayProjects.map(c => (
                        <ProjectDeadlineBlock key={c.id} contact={c} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekActivityRow({
  activity,
  onShare,
  onEdit,
}: {
  activity: ActivityWithContact
  onShare: (a: ActivityWithContact) => void
  onEdit: (a: ActivityWithContact) => void
}) {
  const cfg = ACTIVITY_TYPE_CONFIG[activity.type]
  const status = activityStatus(activity)
  const badge = STATUS_BADGE_CONFIG[status]
  const isMeetingWithLink = activity.type === 'reuniao' && !!activity.meetingLink
  const isProjectTask = activity.type === 'tarefa'

  return (
    <div className="rounded p-1.5 space-y-1" style={{ backgroundColor: 'rgba(242,240,235,0.04)' }}>
      <div className="flex items-center gap-1">
        <cfg.Icon size={10} style={{ color: cfg.color, flexShrink: 0 }} />
        <span className="text-[9px] font-medium" style={{ color: '#F2F0EB' }}>
          {formatTime(activity.scheduledFor)}
        </span>
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {isProjectTask && (
            <span
              className="text-[8px] px-1 py-0.5 rounded font-semibold"
              style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
            >
              Projeto
            </span>
          )}
          <span
            className="text-[8px] px-1 py-0.5 rounded font-semibold"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
          <button
            onClick={() => onEdit(activity)}
            title="Editar"
            className="p-0.5 rounded transition-colors hover:bg-white/10"
          >
            <Pencil size={9} style={{ color: '#a8adb8' }} />
          </button>
        </div>
      </div>
      <Link
        href={`/admin?contactId=${activity.contactId}`}
        className="text-[10px] font-medium hover:underline block truncate"
        style={{ color: '#FF6B35' }}
      >
        {activity.contactName}
      </Link>
      {activity.note && (
        <p className="text-[9px] truncate" style={{ color: '#a8adb8' }}>
          {truncate(activity.note, 60)}
        </p>
      )}
      {isMeetingWithLink && (
        <div className="flex items-center gap-1 pt-0.5">
          <a
            href={activity.meetingLink}
            target="_blank"
            rel="noreferrer"
            title="Abrir reunião"
            className="p-1 rounded transition-colors hover:bg-white/10"
            style={{ color: '#3D5A80' }}
          >
            <ExternalLink size={10} />
          </a>
          <button
            onClick={() => onShare(activity)}
            title="Compartilhar"
            className="p-1 rounded transition-colors hover:bg-white/10"
            style={{ color: '#FF6B35' }}
          >
            <Share2 size={10} />
          </button>
        </div>
      )}
    </div>
  )
}

function ProjectDeadlineBlock({ contact }: { contact: Contact }) {
  const ps = contact.projectStatus!
  const deadline = new Date(`${ps.deadline}T00:00:00`)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const isOverdue = ps.status !== 'Entregue' && deadline < todayStart

  return (
    <div
      className="rounded p-1.5 space-y-1"
      style={{ backgroundColor: '#1a2535', borderLeft: '3px solid #3D5A80' }}
    >
      <div className="flex items-center gap-1">
        <Flag size={10} style={{ color: '#3D5A80', flexShrink: 0 }} />
        <span className="text-[9px] font-medium truncate" style={{ color: '#F2F0EB' }}>
          📌 Prazo: {contact.name}{contact.company ? ` — ${contact.company}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        <span
          className="text-[8px] px-1 py-0.5 rounded font-semibold"
          style={{ backgroundColor: `${PROJECT_STATUS_COLOR[ps.status]}20`, color: PROJECT_STATUS_COLOR[ps.status] }}
        >
          {ps.status}
        </span>
        {isOverdue && (
          <span
            className="text-[8px] px-1 py-0.5 rounded font-semibold"
            style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
          >
            Atrasado
          </span>
        )}
      </div>
    </div>
  )
}

// ── Aba: Lista ──────────────────────────────────────────────────────────

function ListaTab({
  activities,
  listFilter,
  setListFilter,
  onToggle,
  onDelete,
  onShare,
  onEdit,
}: {
  activities: ActivityWithContact[]
  listFilter: ListFilter
  setListFilter: (f: ListFilter) => void
  onToggle: (a: ActivityWithContact, completed: boolean) => void
  onDelete: (a: ActivityWithContact) => void
  onShare: (a: ActivityWithContact) => void
  onEdit: (a: ActivityWithContact) => void
}) {
  const filtered = activities.filter(a => matchesFilter(a, listFilter))
  const groups = groupByDate(filtered)
  const isEmpty = groups.every(g => g.items.length === 0)

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {LIST_FILTERS.map(f => {
          const active = listFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setListFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
              style={{
                backgroundColor: active ? 'rgba(255,107,53,0.15)' : 'rgba(242,240,235,0.06)',
                borderColor: active ? '#FF6B35' : 'rgba(242,240,235,0.15)',
                color: active ? '#FF6B35' : '#a8adb8',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {isEmpty && (
        <div
          className="rounded-lg py-16 text-center text-sm"
          style={{ color: '#6b7280', border: '1px dashed rgba(242,240,235,0.1)' }}
        >
          Nenhuma atividade encontrada
        </div>
      )}

      {groups.map(g => g.items.length > 0 && (
        <div key={g.key} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
            {g.label}
          </p>
          <div className="space-y-2">
            {g.items.map(a => (
              <ListActivityRow key={a.id} activity={a} onToggle={onToggle} onDelete={onDelete} onShare={onShare} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListActivityRow({
  activity,
  onToggle,
  onDelete,
  onShare,
  onEdit,
}: {
  activity: ActivityWithContact
  onToggle: (a: ActivityWithContact, completed: boolean) => void
  onDelete: (a: ActivityWithContact) => void
  onShare: (a: ActivityWithContact) => void
  onEdit: (a: ActivityWithContact) => void
}) {
  const cfg = ACTIVITY_TYPE_CONFIG[activity.type]
  const status = activityStatus(activity)
  const badge = STATUS_BADGE_CONFIG[status]
  const isMeetingWithLink = activity.type === 'reuniao' && !!activity.meetingLink
  const isProjectTask = activity.type === 'tarefa'

  return (
    <div
      className="flex items-start gap-2.5 rounded-lg p-3 group transition-colors"
      style={{
        backgroundColor: '#1e222b',
        border: '1px solid rgba(242,240,235,0.08)',
        opacity: activity.completed ? 0.6 : 1,
      }}
    >
      <button
        onClick={() => onToggle(activity, !activity.completed)}
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

      <cfg.Icon size={14} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin?contactId=${activity.contactId}`}
            className="text-xs font-semibold hover:underline"
            style={{ color: '#F2F0EB' }}
          >
            {activity.contactName}
          </Link>
          <span className="text-[10px]" style={{ color: '#6b7280' }}>
            {formatTime(activity.scheduledFor)}
          </span>
          {isProjectTask && (
            <span
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
            >
              Projeto
            </span>
          )}
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
        {activity.note && (
          <p
            className="text-xs mt-0.5"
            style={{ color: '#a8adb8', textDecoration: activity.completed ? 'line-through' : 'none' }}
          >
            {activity.note}
          </p>
        )}
        {isMeetingWithLink && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <a
              href={activity.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded transition-colors hover:bg-white/10"
              style={{ color: '#3D5A80', border: '1px solid rgba(61,90,128,0.4)' }}
            >
              <ExternalLink size={10} />
              Abrir reunião
            </a>
            <button
              onClick={() => onShare(activity)}
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded transition-colors hover:bg-white/10"
              style={{ color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
            >
              <Share2 size={10} />
              Compartilhar
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(activity)}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          <Pencil size={13} style={{ color: '#a8adb8' }} />
        </button>
        <button
          onClick={() => onDelete(activity)}
          className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={13} style={{ color: '#6b7280' }} />
        </button>
      </div>
    </div>
  )
}

// ── Aba: Projetos ───────────────────────────────────────────────────────

function ProjetosTab({
  contacts,
  taskCountMap,
  onEdit,
  onTaskCountLoaded,
  onTaskAdded,
  onTaskDeleted,
}: {
  contacts: Contact[]
  taskCountMap: Record<string, number>
  onEdit: (c: Contact) => void
  onTaskCountLoaded: (contactId: string, count: number) => void
  onTaskAdded: (contactId: string) => void
  onTaskDeleted: (contactId: string) => void
}) {
  const projects = contacts.filter(c => c.status === 'Fechado')

  if (projects.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <div
          className="rounded-lg py-16 text-center text-sm"
          style={{ color: '#6b7280', border: '1px dashed rgba(242,240,235,0.1)' }}
        >
          Nenhum projeto fechado ainda.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-3">
      {projects.map(c => (
        <ProjectRow
          key={c.id}
          contact={c}
          taskCount={taskCountMap[c.id] ?? 0}
          onEdit={() => onEdit(c)}
          onTaskCountLoaded={onTaskCountLoaded}
          onTaskAdded={onTaskAdded}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  )
}

function ProjectRow({
  contact,
  taskCount,
  onEdit,
  onTaskCountLoaded,
  onTaskAdded,
  onTaskDeleted,
}: {
  contact: Contact
  taskCount: number
  onEdit: () => void
  onTaskCountLoaded: (contactId: string, count: number) => void
  onTaskAdded: (contactId: string) => void
  onTaskDeleted: (contactId: string) => void
}) {
  const ps = contact.projectStatus
  const deadlineInfo = ps && ps.status !== 'Entregue' ? daysRemainingLabel(ps.deadline) : null

  return (
    <div
      className="rounded-lg"
      style={{ backgroundColor: '#1e222b', border: '1px solid rgba(242,240,235,0.08)' }}
    >
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>{contact.name}</p>
          {contact.company && (
            <p className="text-xs" style={{ color: '#a8adb8' }}>{contact.company}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {ps ? (
            <>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: `${PROJECT_STATUS_COLOR[ps.status]}20`, color: PROJECT_STATUS_COLOR[ps.status] }}
              >
                {ps.status}
              </span>
              <span className="text-[10px]" style={{ color: '#6b7280' }}>
                Início: {formatShortDate(ps.startDate)}
              </span>
              <span className="text-[10px]" style={{ color: '#6b7280' }}>
                Prazo: {formatShortDate(ps.deadline)}
              </span>
              {deadlineInfo && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    backgroundColor: deadlineInfo.overdue ? 'rgba(239,68,68,0.15)' : 'rgba(107,114,128,0.15)',
                    color: deadlineInfo.overdue ? '#ef4444' : '#a8adb8',
                  }}
                >
                  {deadlineInfo.text}
                </span>
              )}
            </>
          ) : (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: 'rgba(107,114,128,0.15)', color: '#6b7280' }}
            >
              Sem informações de projeto
            </span>
          )}
          <button
            onClick={onEdit}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-white/10"
            style={{ color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)' }}
          >
            Editar
          </button>
        </div>
      </div>

      <ProjectTasksSection
        contactId={contact.id}
        taskCount={taskCount}
        onCountLoaded={onTaskCountLoaded}
        onTaskAdded={onTaskAdded}
        onTaskDeleted={onTaskDeleted}
      />
    </div>
  )
}

function ProjectTasksSection({
  contactId,
  taskCount,
  onCountLoaded,
  onTaskAdded,
  onTaskDeleted,
}: {
  contactId: string
  taskCount: number
  onCountLoaded: (contactId: string, count: number) => void
  onTaskAdded: (contactId: string) => void
  onTaskDeleted: (contactId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formScheduledFor, setFormScheduledFor] = useState(nextHourISO())
  const [formNote, setFormNote] = useState('')
  const [saving, setSaving] = useState(false)

  function toggleExpand() {
    const next = !expanded
    setExpanded(next)
    if (next && !loaded) {
      setLoading(true)
      fetch(`/api/activities/${contactId}`)
        .then(r => (r.ok ? r.json() : []))
        .then((data: Activity[]) => {
          const projectTasks = Array.isArray(data) ? data.filter(a => a.type === 'tarefa') : []
          setTasks(projectTasks)
          setLoaded(true)
          onCountLoaded(contactId, projectTasks.length)
        })
        .catch(() => setLoaded(true))
        .finally(() => setLoading(false))
    }
  }

  async function toggleTaskCompleted(id: string, completed: boolean) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed, completedAt: completed ? new Date().toISOString() : undefined } : t)),
    )
    await fetch(`/api/activities/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    }).catch(() => {})
  }

  async function deleteTask(id: string) {
    if (!window.confirm('Excluir esta tarefa?')) return
    setTasks(prev => prev.filter(t => t.id !== id))
    onTaskDeleted(contactId)
    await fetch(`/api/activities/${contactId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  async function handleAddTask() {
    if (!formScheduledFor) return
    setSaving(true)
    const task: Activity = {
      id: uid(),
      contactId,
      type: 'tarefa',
      scheduledFor: new Date(formScheduledFor).toISOString(),
      note: formNote.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    try {
      await fetch(`/api/activities/${contactId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      setTasks(prev => [task, ...prev])
      onTaskAdded(contactId)
      setShowForm(false)
      setFormScheduledFor(nextHourISO())
      setFormNote('')
    } finally {
      setSaving(false)
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))

  return (
    <div style={{ borderTop: '1px solid rgba(242,240,235,0.07)' }}>
      <button
        onClick={toggleExpand}
        className="flex items-center gap-1.5 w-full text-left px-4 py-2.5 transition-colors hover:bg-white/5"
      >
        {expanded ? <ChevronDown size={12} style={{ color: '#a8adb8' }} /> : <ChevronRight size={12} style={{ color: '#a8adb8' }} />}
        <span className="text-xs font-medium" style={{ color: '#a8adb8' }}>
          Tarefas ({taskCount})
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {loading ? (
            <p className="text-xs py-4 text-center" style={{ color: '#6b7280' }}>Carregando tarefas...</p>
          ) : (
            <>
              {sortedTasks.length === 0 && (
                <p className="text-xs py-2" style={{ color: '#6b7280' }}>Nenhuma tarefa cadastrada.</p>
              )}

              {sortedTasks.length > 0 && (
                <div className="space-y-1.5">
                  {sortedTasks.map(t => (
                    <ProjectTaskItem key={t.id} task={t} onToggle={toggleTaskCompleted} onDelete={deleteTask} />
                  ))}
                </div>
              )}

              {showForm ? (
                <div
                  className="rounded-lg p-3 space-y-2"
                  style={{ backgroundColor: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.1)' }}
                >
                  <input
                    type="datetime-local"
                    value={formScheduledFor}
                    onChange={e => setFormScheduledFor(e.target.value)}
                    className="flex h-9 w-full rounded-lg border px-3 text-xs"
                    style={selectStyle}
                  />
                  <textarea
                    value={formNote}
                    onChange={e => setFormNote(e.target.value)}
                    rows={2}
                    placeholder="Descreva a tarefa..."
                    className="flex w-full rounded-lg border px-3 py-2 text-xs resize-none focus:outline-none"
                    style={textareaStyle}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => setShowForm(false)}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={!formScheduledFor || saving}
                      style={{ backgroundColor: '#FF6B35', color: '#fff' }}
                      onClick={handleAddTask}
                    >
                      {saving ? 'Salvando...' : 'Salvar tarefa'}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setShowForm(true); setFormScheduledFor(nextHourISO()) }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg w-full justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px dashed rgba(242,240,235,0.2)', color: '#a8adb8' }}
                >
                  <Plus size={12} />
                  Nova tarefa
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ProjectTaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Activity
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  const status = activityStatus(task)
  const badge = STATUS_BADGE_CONFIG[status]

  return (
    <div
      className="flex items-start gap-2 rounded-lg p-2 group transition-colors"
      style={{
        backgroundColor: 'rgba(242,240,235,0.03)',
        border: '1px solid rgba(242,240,235,0.07)',
        opacity: task.completed ? 0.6 : 1,
      }}
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className="mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: task.completed ? '#22c55e' : 'transparent',
          borderColor: task.completed ? '#22c55e' : 'rgba(242,240,235,0.25)',
        }}
      >
        {task.completed && (
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px]" style={{ color: '#6b7280' }}>
            {formatDateTime(task.scheduledFor)}
          </span>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
        {task.note && (
          <p
            className="text-xs mt-0.5"
            style={{ color: '#a8adb8', textDecoration: task.completed ? 'line-through' : 'none' }}
          >
            {task.note}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 shrink-0"
      >
        <Trash2 size={11} style={{ color: '#6b7280' }} />
      </button>
    </div>
  )
}

function ProjectEditModal({
  contact,
  open,
  onClose,
  onSave,
}: {
  contact: Contact | null
  open: boolean
  onClose: () => void
  onSave: (contactId: string, ps: ProjectStatus) => void
}) {
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [status, setStatus] = useState<ProjectStatus['status']>('Em andamento')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open || !contact) return
    const ps = contact.projectStatus
    setStartDate(ps?.startDate ?? todayISODate())
    setDeadline(ps?.deadline ?? todayISODate())
    setStatus(ps?.status ?? 'Em andamento')
    setNotes(ps?.notes ?? '')
  }, [open, contact])

  function handleSave() {
    if (!contact) return
    onSave(contact.id, { startDate, deadline, status, notes })
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed', zIndex: 70,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '92vw',
            maxWidth: '26rem',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              Status do projeto — {contact?.name}
            </Dialog.Title>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Data de início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="flex h-9 w-full rounded-lg border px-3 text-xs"
                  style={selectStyle}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Prazo de entrega</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="flex h-9 w-full rounded-lg border px-3 text-xs"
                  style={selectStyle}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProjectStatus['status'])}
                className="flex h-9 w-full rounded-lg border px-3 text-xs"
                style={selectStyle}
              >
                <option value="Em andamento" style={{ backgroundColor: '#1e222b' }}>Em andamento</option>
                <option value="Aguardando cliente" style={{ backgroundColor: '#1e222b' }}>Aguardando cliente</option>
                <option value="Entregue" style={{ backgroundColor: '#1e222b' }}>Entregue</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Observações</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border px-3 py-2 text-xs resize-none focus:outline-none"
                style={textareaStyle}
              />
            </div>
          </div>

          <div
            className="flex items-center justify-end gap-2 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" onClick={handleSave} style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
              Salvar
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ── Modal de edição de atividade ────────────────────────────────────────

function ActivityEditModal({
  activity,
  open,
  onClose,
  onSave,
}: {
  activity: ActivityWithContact | null
  open: boolean
  onClose: () => void
  onSave: (
    id: string,
    contactId: string,
    patch: { type: ActivityType; scheduledFor: string; note: string; meetingLink: string | null },
  ) => void
}) {
  const [type, setType] = useState<ActivityType>('lembrete')
  const [scheduledFor, setScheduledFor] = useState('')
  const [note, setNote] = useState('')
  const [meetingLink, setMeetingLink] = useState('')

  useEffect(() => {
    if (!open || !activity) return
    setType(activity.type)
    setScheduledFor(toDatetimeLocalInput(activity.scheduledFor))
    setNote(activity.note)
    setMeetingLink(activity.meetingLink ?? '')
  }, [open, activity])

  function handleSave() {
    if (!activity || !scheduledFor) return
    onSave(activity.id, activity.contactId, {
      type,
      scheduledFor: new Date(scheduledFor).toISOString(),
      note: note.trim(),
      meetingLink: type === 'reuniao' ? (meetingLink.trim() || null) : null,
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed', zIndex: 70,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '92vw',
            maxWidth: '28rem',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              Editar atividade{activity ? ` — ${activity.contactName}` : ''}
            </Dialog.Title>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Tipo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ActivityType)}
                className="flex h-9 w-full rounded-lg border px-3 text-xs"
                style={selectStyle}
              >
                {(Object.entries(ACTIVITY_TYPE_CONFIG) as [ActivityType, typeof ACTIVITY_TYPE_CONFIG[ActivityType]][]).map(([key, cfg]) => (
                  <option key={key} value={key} style={{ backgroundColor: '#1e222b' }}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Data e hora</label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={e => setScheduledFor(e.target.value)}
                className="flex h-9 w-full rounded-lg border px-3 text-xs"
                style={selectStyle}
              />
            </div>

            {type === 'reuniao' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Link da reunião</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="flex h-9 w-full rounded-lg border px-3 text-xs"
                  style={selectStyle}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>Nota</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border px-3 py-2 text-xs resize-none focus:outline-none"
                style={textareaStyle}
              />
            </div>
          </div>

          <div
            className="flex items-center justify-end gap-2 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" disabled={!scheduledFor} onClick={handleSave} style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
              Salvar alterações
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
