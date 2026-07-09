import { Bell, Phone, Calendar, MessageCircle, CheckSquare } from 'lucide-react'
import type { Activity } from './_types'

export type ActivityType = Activity['type']

export const ACTIVITY_TYPE_CONFIG: Record<
  ActivityType,
  { label: string; Icon: React.ElementType; color: string }
> = {
  lembrete: { label: 'Atividade', Icon: Bell, color: '#f59e0b' },
  ligacao: { label: 'Ligação', Icon: Phone, color: '#22c55e' },
  reuniao: { label: 'Reunião', Icon: Calendar, color: '#3D5A80' },
  mensagem: { label: 'Mensagem', Icon: MessageCircle, color: '#a855f7' },
  tarefa: { label: 'Tarefa de Projeto', Icon: CheckSquare, color: '#FF6B35' },
}

export type ActivityStatus = 'pendente' | 'concluido' | 'atrasado'

export function activityStatus(a: Pick<Activity, 'completed' | 'scheduledFor'>): ActivityStatus {
  if (a.completed) return 'concluido'
  if (new Date(a.scheduledFor) < new Date()) return 'atrasado'
  return 'pendente'
}

export const STATUS_BADGE_CONFIG: Record<ActivityStatus, { label: string; bg: string; color: string }> = {
  pendente: { label: 'Pendente', bg: 'rgba(61,90,128,0.2)', color: '#7a9abf' },
  concluido: { label: 'Concluído', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  atrasado: { label: 'Atrasado', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function toDatetimeLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}…`
}

export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function startOfWeek(d: Date): Date {
  const monday = new Date(d)
  monday.setHours(0, 0, 0, 0)
  const day = monday.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  monday.setDate(monday.getDate() + diff)
  return monday
}

export function getWeekDays(weekOffset: number): Date[] {
  const monday = startOfWeek(new Date())
  monday.setDate(monday.getDate() + weekOffset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}
