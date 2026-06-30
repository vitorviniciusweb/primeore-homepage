'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X, Trash2, ChevronRight, ChevronDown, Plus, Check, Users, Camera, Video, Briefcase, Music2, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Contact, Collaborator, Temperature, SocialMedia } from '../_types'
import { COLUMNS } from '../_data'
import { ActivitySection } from './ActivitySection'

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
  nicho: string
  services: string[]
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

type CustomSocial = {
  id: string
  platform: string
  url: string
}

const SERVICE_OPTIONS = [
  'Site Institucional',
  'Site Ecommerce',
  'Site Landing Page',
  'Tráfego Pago',
  'Disparo WhatsApp',
  'Desenvolvimento de Sistema',
  'Desenvolvimento de Projeto',
]

const FIXED_PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  Icon: Users,     placeholder: 'facebook.com/suapagina' },
  { id: 'instagram', label: 'Instagram', Icon: Camera,    placeholder: 'instagram.com/seuperfil' },
  { id: 'youtube',   label: 'YouTube',   Icon: Video,     placeholder: 'youtube.com/@seucanal' },
  { id: 'linkedin',  label: 'LinkedIn',  Icon: Briefcase, placeholder: 'linkedin.com/in/seuperfil' },
  { id: 'spotify',   label: 'Spotify',   Icon: Music2,    placeholder: 'open.spotify.com/...' },
]

const FIXED_PLATFORM_IDS = new Set<string>(FIXED_PLATFORMS.map(p => p.id))

function emptyForm(): FormState {
  return {
    name: '',
    company: '',
    nicho: '',
    services: [],
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
  return { id: Math.random().toString(36).slice(2), name: '', role: '', phone: '', email: '' }
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 text-xs text-left py-0.5"
      style={{ color: checked ? '#F2F0EB' : '#a8adb8' }}
    >
      <span
        className="w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors"
        style={{
          backgroundColor: checked ? '#FF6B35' : '#1e2229',
          borderColor: checked ? '#FF6B35' : '#3D5A80',
        }}
      >
        {checked && <Check size={9} strokeWidth={3} style={{ color: '#fff' }} />}
      </span>
      {label}
    </button>
  )
}

function ProspeccaoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>{label}</span>
      <span className="text-xs text-right" style={{ color: '#F2F0EB' }}>{value}</span>
    </div>
  )
}

export function ContactModal({ open, onClose, onSave, onDelete, initial }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm())
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [collabs, setCollabs] = useState<CollabDraft[]>([])
  const [collabOpen, setCollabOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dados' | 'atividades'>('dados')

  const [activePlatforms, setActivePlatforms] = useState<Set<string>>(new Set())
  const [platformUrls, setPlatformUrls] = useState<Record<string, string>>({})
  const [customSocials, setCustomSocials] = useState<CustomSocial[]>([])

  useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        name: initial.name,
        company: initial.company,
        nicho: initial.nicho ?? '',
        services: initial.services ?? [],
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
          id: c.id, name: c.name, role: c.role,
          phone: c.phone ?? '', email: c.email ?? '',
        })),
      )
      const sm = initial.socialMedia ?? []
      const newActive = new Set<string>()
      const newUrls: Record<string, string> = {}
      const newCustom: CustomSocial[] = []
      for (const entry of sm) {
        if (FIXED_PLATFORM_IDS.has(entry.platform)) {
          newActive.add(entry.platform)
          newUrls[entry.platform] = entry.url
        } else {
          newCustom.push({ id: Math.random().toString(36).slice(2), platform: entry.platform, url: entry.url })
        }
      }
      setActivePlatforms(newActive)
      setPlatformUrls(newUrls)
      setCustomSocials(newCustom.slice(0, 3))
    } else {
      setForm(emptyForm())
      setCollabs([])
      setActivePlatforms(new Set())
      setPlatformUrls({})
      setCustomSocials([])
    }
    setErrors({})
    setConfirmDelete(false)
    setCollabOpen(false)
    setActiveTab('dados')
  }, [open, initial])

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  function toggleService(svc: string) {
    setForm(f => ({
      ...f,
      services: f.services.includes(svc)
        ? f.services.filter(s => s !== svc)
        : [...f.services, svc],
    }))
    if (errors.services) setErrors(e => { const n = { ...e }; delete n.services; return n })
  }

  function togglePlatform(id: string) {
    setActivePlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setPlatformUrls(u => { const n = { ...u }; delete n[id]; return n })
      } else {
        next.add(id)
      }
      return next
    })
  }

  function setCollab(id: string, field: keyof CollabDraft, value: string) {
    setCollabs(prev =>
      prev.map(c => c.id === id ? { ...c, [field]: field === 'phone' ? maskPhone(value) : value } : c),
    )
  }

  function addCollab() {
    setCollabs(prev => [...prev, emptyCollab()])
    setCollabOpen(true)
  }

  function removeCollab(id: string) {
    setCollabs(prev => prev.filter(c => c.id !== id))
  }

  function addCustomSocial() {
    if (customSocials.length >= 3) return
    setCustomSocials(prev => [...prev, { id: Math.random().toString(36).slice(2), platform: '', url: '' }])
  }

  function removeCustomSocial(id: string) {
    setCustomSocials(prev => prev.filter(s => s.id !== id))
  }

  function updateCustomSocial(id: string, field: 'platform' | 'url', value: string) {
    setCustomSocials(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Campo obrigatório'
    if (!form.company.trim()) e.company = 'Campo obrigatório'
    if (form.services.length === 0) e.services = 'Selecione ao menos um serviço'
    if (!form.channel.trim()) e.channel = 'Campo obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function buildSocialMedia(): SocialMedia[] | undefined {
    const fixed = FIXED_PLATFORMS
      .filter(p => activePlatforms.has(p.id) && (platformUrls[p.id] ?? '').trim())
      .map(p => ({ platform: p.id, url: platformUrls[p.id].trim() }))
    const custom = customSocials
      .filter(s => s.platform.trim() && s.url.trim())
      .map(s => ({ platform: s.platform.trim(), url: s.url.trim() }))
    const all = [...fixed, ...custom]
    return all.length > 0 ? all : undefined
  }

  function handleSave() {
    if (!validate()) return
    const now = new Date().toISOString()
    const saved: Collaborator[] = collabs
      .filter(c => c.name.trim())
      .map(c => ({
        id: c.id, name: c.name.trim(), role: c.role.trim(),
        phone: c.phone.trim() || undefined, email: c.email.trim() || undefined,
      }))

    onSave({
      id: initial?.id ?? Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: form.name.trim(),
      company: form.company.trim(),
      nicho: form.nicho.trim() || undefined,
      services: form.services,
      channel: form.channel.trim(),
      lastContact: form.lastContact ? new Date(form.lastContact + 'T00:00:00').toISOString() : now,
      notes: form.notes.trim(),
      status: form.status,
      temperature: form.temperature,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      collaborators: saved.length > 0 ? saved : undefined,
      lostReason: form.status === 'Perdido' ? form.lostReason.trim() : undefined,
      createdAt: initial?.createdAt ?? now,
      socialMedia: buildSocialMedia(),
      // Preserve import-specific read-only fields
      categoria: initial?.categoria,
      statusSite: initial?.statusSite,
      linkSocial: initial?.linkSocial,
      endereco: initial?.endereco,
      nota: initial?.nota,
      avaliacoes: initial?.avaliacoes,
      linkMaps: initial?.linkMaps,
      briefingPreenchido: initial?.briefingPreenchido,
    })
    onClose()
  }

  const hasImportData = !!(
    initial?.categoria || initial?.statusSite || initial?.linkSocial ||
    initial?.endereco || initial?.nota !== undefined ||
    initial?.avaliacoes !== undefined || initial?.linkMaps
  )

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed', zIndex: 50,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '96vw',
            maxWidth: '68rem',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              {initial ? 'Editar contato' : 'Novo contato'}
            </Dialog.Title>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          {/* ── Tabs ── */}
          <div
            className="flex shrink-0 px-5"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            {(['dados', 'atividades'] as const).map(tab => {
              const active = activeTab === tab
              const disabled = tab === 'atividades' && !initial
              return (
                <button
                  key={tab}
                  disabled={disabled}
                  title={disabled ? 'Disponível após salvar o contato' : undefined}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    color: active ? '#FF6B35' : '#6b7280',
                    borderBottom: active ? '2px solid #FF6B35' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {tab === 'dados' ? 'Dados' : 'Atividades'}
                </button>
              )
            })}
          </div>

          {/* ── Body ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Aba: Dados ── */}
            {activeTab === 'dados' && (
              <div className="px-5 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">

                  {/* ── COLUNA ESQUERDA ── */}
                  <div className="space-y-4 pb-4">

                    {/* Nome + Empresa/Negócio */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nome *" error={errors.name}>
                        <Input
                          value={form.name}
                          onChange={e => set('name', e.target.value)}
                          placeholder="Nome do contato"
                        />
                      </Field>
                      <Field label="Empresa / Negócio *" error={errors.company}>
                        <Input
                          value={form.company}
                          onChange={e => set('company', e.target.value)}
                          placeholder="Ex: Clínica Sorriso Santos"
                        />
                      </Field>
                    </div>

                    {/* Nicho / Segmento */}
                    <Field label="Nicho / Segmento">
                      <Input
                        value={form.nicho}
                        onChange={e => set('nicho', e.target.value)}
                        placeholder="Ex: Advocacia, Estética, Dentista..."
                      />
                    </Field>

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

                    {/* Canal de origem */}
                    <Field label="Canal de origem *" error={errors.channel}>
                      <Input
                        value={form.channel}
                        onChange={e => set('channel', e.target.value)}
                        placeholder="Ex: Indicação"
                      />
                    </Field>
                  </div>

                  {/* ── COLUNA DIREITA ── */}
                  <div
                    className="space-y-4 pb-4 lg:pl-6 lg:border-l"
                    style={{ borderColor: 'rgba(242,240,235,0.07)' }}
                  >
                    {/* Serviços de interesse */}
                    <Field label="Serviços de interesse *" error={errors.services}>
                      <div
                        className="grid grid-cols-1 gap-y-2 mt-0.5 p-3 rounded-lg"
                        style={{ backgroundColor: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.08)' }}
                      >
                        {SERVICE_OPTIONS.map(svc => (
                          <CheckboxItem
                            key={svc}
                            label={svc}
                            checked={form.services.includes(svc)}
                            onChange={() => toggleService(svc)}
                          />
                        ))}
                      </div>
                    </Field>

                    {/* Informações de contato */}
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

                    {/* Redes Sociais */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                        Redes Sociais
                      </p>

                      <div className="space-y-2">
                        {FIXED_PLATFORMS.map(({ id, label, Icon, placeholder }) => {
                          const isActive = activePlatforms.has(id)
                          return (
                            <div key={id}>
                              <button
                                onClick={() => togglePlatform(id)}
                                className="flex items-center gap-2 w-full text-left py-0.5"
                              >
                                <span
                                  className="w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors"
                                  style={{
                                    backgroundColor: isActive ? '#FF6B35' : '#1e2229',
                                    borderColor: isActive ? '#FF6B35' : '#3D5A80',
                                  }}
                                >
                                  {isActive && <Check size={9} strokeWidth={3} style={{ color: '#fff' }} />}
                                </span>
                                <Icon size={13} style={{ color: isActive ? '#FF6B35' : '#6b7280', flexShrink: 0 }} />
                                <span className="text-xs" style={{ color: isActive ? '#F2F0EB' : '#a8adb8' }}>
                                  {label}
                                </span>
                              </button>
                              {isActive && (
                                <div className="ml-6 mt-1.5">
                                  <Input
                                    value={platformUrls[id] ?? ''}
                                    onChange={e => setPlatformUrls(prev => ({ ...prev, [id]: e.target.value }))}
                                    placeholder={placeholder}
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {customSocials.length > 0 && (
                        <div className="space-y-2 pt-1">
                          {customSocials.map(s => (
                            <div key={s.id} className="flex items-center gap-2">
                              <Input
                                value={s.platform}
                                onChange={e => updateCustomSocial(s.id, 'platform', e.target.value)}
                                placeholder="Nome da rede"
                                className="flex-1"
                              />
                              <Input
                                value={s.url}
                                onChange={e => updateCustomSocial(s.id, 'url', e.target.value)}
                                placeholder="URL do perfil"
                                className="flex-1"
                              />
                              <button
                                onClick={() => removeCustomSocial(s.id)}
                                className="p-1.5 rounded hover:bg-red-500/20 transition-colors shrink-0"
                              >
                                <X size={13} style={{ color: '#a8adb8' }} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {customSocials.length < 3 && (
                        <button
                          onClick={addCustomSocial}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                          style={{ border: '1px dashed rgba(242,240,235,0.2)', color: '#a8adb8' }}
                        >
                          <Plus size={12} />
                          Adicionar outra rede
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── LARGURA TOTAL — Colaboradores ── */}
                  <div
                    className="col-span-1 lg:col-span-2 space-y-3"
                    style={{ borderTop: '1px solid rgba(242,240,235,0.07)', paddingTop: '1rem' }}
                  >
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
                                <Input value={c.name} onChange={e => setCollab(c.id, 'name', e.target.value)} placeholder="Nome" />
                              </Field>
                              <Field label="Cargo *">
                                <Input value={c.role} onChange={e => setCollab(c.id, 'role', e.target.value)} placeholder="Ex: Sócio, Gerente" />
                              </Field>
                              <Field label="Telefone">
                                <Input value={c.phone} onChange={e => setCollab(c.id, 'phone', e.target.value)} placeholder="(11) 99999-9999" inputMode="tel" />
                              </Field>
                              <Field label="E-mail">
                                <Input type="email" value={c.email} onChange={e => setCollab(c.id, 'email', e.target.value)} placeholder="email@empresa.com" />
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
                  </div>

                  {/* ── LARGURA TOTAL — Dados da Prospecção (import-only, read-only) ── */}
                  {hasImportData && (
                    <div
                      className="col-span-1 lg:col-span-2 space-y-3"
                      style={{ borderTop: '1px solid rgba(242,240,235,0.07)', paddingTop: '1rem' }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                        Dados da Prospecção
                      </p>
                      <div
                        className="rounded-lg p-3 space-y-2.5"
                        style={{ backgroundColor: 'rgba(242,240,235,0.04)', border: '1px solid rgba(242,240,235,0.08)' }}
                      >
                        {initial?.categoria && (
                          <ProspeccaoRow label="Categoria" value={initial.categoria} />
                        )}
                        {initial?.statusSite && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>Status do Site</span>
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                              style={{
                                backgroundColor: initial.statusSite === 'Sem site' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                                color: initial.statusSite === 'Sem site' ? '#f87171' : '#22c55e',
                              }}
                            >
                              {initial.statusSite}
                            </span>
                          </div>
                        )}
                        {initial?.linkSocial && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>Link Social</span>
                            <a
                              href={initial.linkSocial.startsWith('http') ? initial.linkSocial : `https://${initial.linkSocial}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs hover:underline truncate"
                              style={{ color: '#FF6B35' }}
                            >
                              Ver perfil
                            </a>
                          </div>
                        )}
                        {initial?.endereco && (
                          <ProspeccaoRow label="Endereço" value={initial.endereco} />
                        )}
                        {(initial?.nota !== undefined || initial?.avaliacoes !== undefined) && (
                          <ProspeccaoRow
                            label="Avaliação"
                            value={`${initial?.nota ?? '—'} ⭐ (${initial?.avaliacoes ?? 0} avaliações)`}
                          />
                        )}
                        {initial?.linkMaps && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs shrink-0" style={{ color: '#6b7280' }}>Google Maps</span>
                            <a
                              href={initial.linkMaps}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs hover:underline"
                              style={{ color: '#3D5A80' }}
                            >
                              Ver no Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── LARGURA TOTAL — Observações ── */}
                  <div
                    className="col-span-1 lg:col-span-2"
                    style={{ borderTop: '1px solid rgba(242,240,235,0.07)', paddingTop: '1rem' }}
                  >
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
                  </div>

                  {/* ── LARGURA TOTAL — Motivo da perda ── */}
                  {form.status === 'Perdido' && (
                    <div className="col-span-1 lg:col-span-2 pt-2">
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
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ── Aba: Atividades ── */}
            {activeTab === 'atividades' && initial && (
              <div className="px-5 py-4">
                <ActivitySection contactId={initial.id} />
              </div>
            )}

          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between gap-3 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid rgba(242,240,235,0.08)' }}
          >
            <div>
              {onDelete &&
                (confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#a8adb8' }}>Confirmar exclusão?</span>
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
              <Button size="sm" onClick={handleSave} style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
                {initial ? 'Salvar alterações' : 'Adicionar'}
              </Button>
            </div>
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
