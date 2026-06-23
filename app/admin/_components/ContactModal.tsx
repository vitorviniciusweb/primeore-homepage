'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X, Trash2, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Contact, Collaborator, Temperature } from '../_types'
import { COLUMNS } from '../_data'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (contact: Contact) => void
  onDelete?: () => void
  initial?: Contact | null
}

type FormState = {
  name: string
  company: string
  service: string
  channel: string
  lastContact: string
  notes: string
  status: string
  temperature: Temperature
  phone: string
  email: string
  lostReason: string
}

type CollabDraft = {
  id: string
  name: string
  role: string
  phone: string
  email: string
}

function emptyForm(): FormState {
  return {
    name: '',
    company: '',
    service: '',
    channel: '',
    lastContact: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    phone: '',
    email: '',
    lostReason: '',
  }
}

function emptyCollab(): CollabDraft {
  return {
    id: Math.random().toString(36).slice(2),
    name: '',
    role: '',
    phone: '',
    email: '',
  }
}

function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
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

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactModal({ open, onClose, onSave, onDelete, initial }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [collabs, setCollabs] = useState<CollabDraft[]>([])
  const [collabOpen, setCollabOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name,
        company: initial.company,
        service: initial.service,
        channel: initial.channel,
        lastContact: initial.lastContact
          ? initial.lastContact.split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: initial.notes ?? '',
        status: initial.status,
        temperature: initial.temperature ?? 'morno',
        phone: initial.phone ?? '',
        email: initial.email ?? '',
        lostReason: initial.lostReason ?? '',
      })
      setCollabs(
        (initial.collaborators ?? []).map(c => ({
          id: c.id,
          name: c.name,
          role: c.role,
          phone: c.phone ?? '',
          email: c.email ?? '',
        })),
      )
    } else {
      setForm(emptyForm())
      setCollabs([])
    }
    setErrors({})
    setConfirmDelete(false)
    setCollabOpen(false)
  }, [open, initial])

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  function setCollab(id: string, field: keyof CollabDraft, value: string) {
    setCollabs(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, [field]: field === 'phone' ? maskPhone(value) : value }
          : c,
      ),
    )
  }

  function addCollab() {
    setCollabs(prev => [...prev, emptyCollab()])
    setCollabOpen(true)
  }

  function removeCollab(id: string) {
    setCollabs(prev => prev.filter(c => c.id !== id))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Campo obrigatório'
    if (!form.company.trim()) e.company = 'Campo obrigatório'
    if (!form.service.trim()) e.service = 'Campo obrigatório'
    if (!form.channel.trim()) e.channel = 'Campo obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const now = new Date().toISOString()
    const saved: Collaborator[] = collabs
      .filter(c => c.name.trim())
      .map(c => ({
        id: c.id,
        name: c.name.trim(),
        role: c.role.trim(),
        phone: c.phone.trim() || undefined,
        email: c.email.trim() || undefined,
      }))

    onSave({
      id: initial?.id ?? Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: form.name.trim(),
      company: form.company.trim(),
      service: form.service.trim(),
      channel: form.channel.trim(),
      lastContact: form.lastContact
        ? new Date(form.lastContact + 'T00:00:00').toISOString()
        : now,
      notes: form.notes.trim(),
      status: form.status,
      temperature: form.temperature,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      collaborators: saved.length > 0 ? saved : undefined,
      lostReason: form.status === 'Perdido' ? form.lostReason.trim() : undefined,
      createdAt: initial?.createdAt ?? now,
    })
    onClose()
  }

  const divider = <div style={{ height: '1px', backgroundColor: 'rgba(242,240,235,0.07)', margin: '0 -1.25rem' }} />

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed',
            zIndex: 50,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '100%',
            maxWidth: '34rem',
            maxHeight: '92vh',
            overflowY: 'auto',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              {initial ? 'Editar contato' : 'Novo contato'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-5 py-4 space-y-4">

            {/* Nome + Empresa */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome *" error={errors.name}>
                <Input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Nome do contato"
                />
              </Field>
              <Field label="Empresa *" error={errors.company}>
                <Input
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="Empresa"
                />
              </Field>
            </div>

            {/* Serviço + Canal */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Serviço de interesse *" error={errors.service}>
                <Input
                  value={form.service}
                  onChange={e => set('service', e.target.value)}
                  placeholder="Ex: Site institucional"
                />
              </Field>
              <Field label="Canal de origem *" error={errors.channel}>
                <Input
                  value={form.channel}
                  onChange={e => set('channel', e.target.value)}
                  placeholder="Ex: Indicação"
                />
              </Field>
            </div>

            {/* Status + Temperatura */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status *">
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className="flex h-10 w-full rounded-lg border px-3 py-2 text-sm"
                  style={selectStyle}
                >
                  {COLUMNS.map(c => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: '#1e222b' }}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Temperatura *">
                <select
                  value={form.temperature}
                  onChange={e => set('temperature', e.target.value as Temperature)}
                  className="flex h-10 w-full rounded-lg border px-3 py-2 text-sm"
                  style={selectStyle}
                >
                  <option value="quente" style={{ backgroundColor: '#1e222b' }}>🔥 Quente</option>
                  <option value="morno"  style={{ backgroundColor: '#1e222b' }}>● Morno</option>
                  <option value="frio"   style={{ backgroundColor: '#1e222b' }}>● Frio</option>
                </select>
              </Field>
            </div>

            {/* Último contato */}
            <Field label="Último contato">
              <Input
                type="date"
                value={form.lastContact}
                onChange={e => set('lastContact', e.target.value)}
              />
            </Field>

            {divider}

            {/* ── Informações de contato ── */}
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
              Informações de contato
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telefone">
                <Input
                  value={form.phone}
                  onChange={e => set('phone', maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                />
              </Field>
              <Field label="E-mail">
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="email@empresa.com"
                />
              </Field>
            </div>

            {divider}

            {/* ── Colaboradores (colapsável) ── */}
            <button
              onClick={() => setCollabOpen(v => !v)}
              className="flex items-center gap-1.5 w-full text-left"
            >
              {collabOpen
                ? <ChevronDown size={13} style={{ color: '#a8adb8' }} />
                : <ChevronRight size={13} style={{ color: '#a8adb8' }} />}
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                Colaboradores ({collabs.length})
              </span>
            </button>

            {collabOpen && (
              <div className="space-y-3">
                {collabs.map(c => (
                  <div
                    key={c.id}
                    className="rounded-lg p-3 space-y-2"
                    style={{ backgroundColor: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.08)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium" style={{ color: '#a8adb8' }}>
                        Colaborador
                      </span>
                      <button
                        onClick={() => removeCollab(c.id)}
                        className="p-1 rounded hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={11} style={{ color: '#a8adb8' }} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Nome *">
                        <Input
                          value={c.name}
                          onChange={e => setCollab(c.id, 'name', e.target.value)}
                          placeholder="Nome"
                        />
                      </Field>
                      <Field label="Cargo *">
                        <Input
                          value={c.role}
                          onChange={e => setCollab(c.id, 'role', e.target.value)}
                          placeholder="Ex: Sócio, Gerente"
                        />
                      </Field>
                      <Field label="Telefone">
                        <Input
                          value={c.phone}
                          onChange={e => setCollab(c.id, 'phone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          inputMode="tel"
                        />
                      </Field>
                      <Field label="E-mail">
                        <Input
                          type="email"
                          value={c.email}
                          onChange={e => setCollab(c.id, 'email', e.target.value)}
                          placeholder="email@empresa.com"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addCollab}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg w-full justify-center transition-colors hover:bg-white/10"
                  style={{ border: '1px dashed rgba(242,240,235,0.2)', color: '#a8adb8' }}
                >
                  <Plus size={12} />
                  Adicionar colaborador
                </button>
              </div>
            )}

            {!collabOpen && collabs.length === 0 && (
              <button
                onClick={addCollab}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg w-full justify-center transition-colors hover:bg-white/10"
                style={{ border: '1px dashed rgba(242,240,235,0.2)', color: '#a8adb8' }}
              >
                <Plus size={12} />
                Adicionar colaborador
              </button>
            )}

            {divider}

            {/* Observações */}
            <Field label="Observações">
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
                placeholder="Anotações sobre o contato..."
                className="flex w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                style={textareaStyle}
              />
            </Field>

            {form.status === 'Perdido' && (
              <Field label="Motivo da perda">
                <textarea
                  value={form.lostReason}
                  onChange={e => set('lostReason', e.target.value)}
                  rows={2}
                  placeholder="Descreva o motivo com precisão..."
                  className="flex w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
                  style={textareaStyle}
                />
              </Field>
            )}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between gap-3 px-5 py-4"
            style={{ borderTop: '1px solid rgba(242,240,235,0.08)' }}
          >
            <div>
              {onDelete &&
                (confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#a8adb8' }}>
                      Confirmar exclusão?
                    </span>
                    <button
                      onClick={() => { onDelete(); onClose() }}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors"
                      style={{ color: '#a8adb8' }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-xs hover:underline"
                    style={{ color: '#6b7280' }}
                  >
                    Excluir contato
                  </button>
                ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                style={{ backgroundColor: '#FF6B35', color: '#fff' }}
              >
                {initial ? 'Salvar alterações' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
