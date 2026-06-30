'use client'

import { useState, useRef } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Upload, X } from 'lucide-react'
import * as XLSX from 'xlsx'
import type { Contact } from '../_types'
import { COLUMNS } from '../_data'
import { Button } from '@/components/ui/button'

const KANBAN_STAGES = COLUMNS.filter(c => c.id !== 'Perdido').map(c => ({ id: c.id, label: c.label }))

type Step = 'upload' | 'preview' | 'result'

type ParsedRow = {
  name: string
  phone: string
  nicho: string
  categoria: string
  bairro: string
  statusSite: 'Sem site' | 'Rede social/Link' | ''
  linkSocial: string
  endereco: string
  nota: number | undefined
  avaliacoes: number | undefined
  linkMaps: string
  notes: string
}

function normalizePhone(p: string): string {
  return String(p ?? '').replace(/\D/g, '')
}

function parseStatusSite(raw: string): 'Sem site' | 'Rede social/Link' | '' {
  const v = String(raw ?? '').trim().toLowerCase()
  if (v.includes('sem')) return 'Sem site'
  if (v.includes('rede') || v.includes('social') || v.includes('link') || v.includes('instagram')) return 'Rede social/Link'
  return ''
}

function parseNum(val: unknown): number | undefined {
  if (val === '' || val === null || val === undefined) return undefined
  const n = Number(val)
  return isNaN(n) ? undefined : n
}

type Props = {
  open: boolean
  onClose: () => void
  existingContacts: Contact[]
  onImport: (contacts: Contact[]) => void
}

const STEP_LABELS = ['1. Upload', '2. Prévia', '3. Resultado']
const STEPS: Step[] = ['upload', 'preview', 'result']

const popupStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 50,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  width: '100%',
  maxWidth: '28rem',
  maxHeight: '92vh',
  overflowY: 'auto',
  backgroundColor: '#1e222b',
  border: '1px solid rgba(242,240,235,0.1)',
  borderRadius: '0.75rem',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
}

export function ImportModal({ open, onClose, existingContacts, onImport }: Props) {
  const [step, setStep] = useState<Step>('upload')
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [selectedStage, setSelectedStage] = useState('Prospecto')
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const existingPhones = new Set(
    existingContacts.map(c => normalizePhone(c.phone ?? '')).filter(Boolean),
  )
  const duplicates = rows.filter(r => {
    const n = normalizePhone(r.phone)
    return n && existingPhones.has(n)
  })

  function reset() {
    setStep('upload')
    setError(null)
    setRows([])
    setSelectedStage('Prospecto')
    setSkipDuplicates(true)
    setResult(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' })

      if (raw.length === 0) {
        setError('A planilha está vazia.')
        return
      }

      const headers = Object.keys(raw[0])
      const required = ['Nome do Negócio', 'Telefone']
      const missing = required.filter(col => !headers.includes(col))
      if (missing.length > 0) {
        setError(`Colunas obrigatórias não encontradas: ${missing.join(', ')}`)
        return
      }

      const parsed: ParsedRow[] = raw
        .filter(r => String(r['Nome do Negócio'] ?? '').trim())
        .map(r => ({
          name: String(r['Nome do Negócio'] ?? '').trim(),
          phone: String(r['Telefone'] ?? '').trim(),
          nicho: String(r['Nicho'] ?? '').trim(),
          categoria: String(r['Categoria Google'] ?? '').trim(),
          bairro: String(r['Bairro'] ?? '').trim(),
          statusSite: parseStatusSite(String(r['Status do Site'] ?? '')),
          linkSocial: String(r['Link (Instagram/Rede)'] ?? '').trim(),
          endereco: String(r['Endereço Completo'] ?? '').trim(),
          nota: parseNum(r['Nota Google']),
          avaliacoes: parseNum(r['Nº Avaliações']),
          linkMaps: String(r['Link Google Maps'] ?? '').trim(),
          notes: String(r['Observação'] ?? '').trim(),
        }))

      if (parsed.length === 0) {
        setError('Nenhum contato válido encontrado. A coluna "Nome do Negócio" está vazia em todas as linhas.')
        return
      }

      setRows(parsed)
      setStep('preview')
    } catch {
      setError('Erro ao ler o arquivo. Verifique se é um .xlsx ou .csv válido e não está corrompido.')
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleConfirm() {
    const toImport = skipDuplicates
      ? rows.filter(r => {
          const n = normalizePhone(r.phone)
          return !n || !existingPhones.has(n)
        })
      : rows

    const now = new Date().toISOString()
    const contacts: Contact[] = toImport.map(r => ({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: r.name,
      company: r.categoria || '',
      services: ['Site Institucional'],
      channel: 'Prospecção Fria',
      lastContact: '',
      notes: r.notes,
      status: selectedStage,
      temperature: 'frio',
      phone: r.phone || undefined,
      createdAt: now,
      nicho: r.nicho || undefined,
      categoria: r.categoria || undefined,
      bairro: r.bairro || undefined,
      statusSite: r.statusSite || undefined,
      linkSocial: r.linkSocial || undefined,
      endereco: r.endereco || undefined,
      nota: r.nota,
      avaliacoes: r.avaliacoes,
      linkMaps: r.linkMaps || undefined,
    }))

    onImport(contacts)
    setResult({ imported: contacts.length, skipped: rows.length - contacts.length })
    setStep('result')
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && handleClose()}>
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
        <Dialog.Popup style={popupStyle}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              Importar contatos
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          {/* Step indicators */}
          <div
            className="flex items-center gap-2 px-5 py-3"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.05)' }}
          >
            {STEPS.map((s, i) => {
              const active = step === s
              const done = (step === 'preview' && i === 0) || (step === 'result' && i <= 1)
              return (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: active
                      ? 'rgba(255,107,53,0.15)'
                      : done
                      ? 'rgba(34,197,94,0.1)'
                      : 'rgba(242,240,235,0.04)',
                    color: active ? '#FF6B35' : done ? '#22c55e' : '#6b7280',
                  }}
                >
                  {STEP_LABELS[i]}
                </span>
              )
            })}
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {/* ── Step 1: Upload ── */}
            {step === 'upload' && (
              <div className="space-y-4">
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors"
                  style={{ borderColor: 'rgba(242,240,235,0.15)' }}
                  onClick={() => fileRef.current?.click()}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,107,53,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(242,240,235,0.15)')}
                >
                  <Upload size={24} style={{ color: '#a8adb8' }} />
                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: '#F2F0EB' }}>
                      Clique para selecionar arquivo
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                      Aceita .xlsx e .csv
                    </p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".xlsx,.csv"
                    className="hidden"
                    onChange={handleFile}
                  />
                </div>

                {error && (
                  <div
                    className="rounded-lg p-3 text-xs"
                    style={{
                      backgroundColor: 'rgba(239,68,68,0.1)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    {error}
                  </div>
                )}

                <p className="text-[11px] leading-relaxed" style={{ color: '#6b7280' }}>
                  Colunas esperadas (nesta ordem):{' '}
                  <span style={{ color: '#a8adb8' }}>Nicho</span> |{' '}
                  <span style={{ color: '#F2F0EB', fontWeight: 600 }}>Nome do Negócio *</span> |{' '}
                  <span style={{ color: '#a8adb8' }}>Categoria Google</span> |{' '}
                  <span style={{ color: '#F2F0EB', fontWeight: 600 }}>Telefone *</span> |{' '}
                  <span style={{ color: '#a8adb8' }}>
                    Status do Site | Link (Instagram/Rede) | Bairro | Endereço Completo | Nota Google | Nº Avaliações | Link Google Maps | Observação
                  </span>
                </p>
              </div>
            )}

            {/* ── Step 2: Preview ── */}
            {step === 'preview' && (
              <div className="space-y-4">
                <div
                  className="rounded-lg p-4 space-y-2"
                  style={{
                    backgroundColor: 'rgba(242,240,235,0.04)',
                    border: '1px solid rgba(242,240,235,0.08)',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
                    {rows.length} contatos detectados na planilha
                  </p>
                  {duplicates.length > 0 && (
                    <p className="text-xs" style={{ color: '#f59e0b' }}>
                      {duplicates.length}{' '}
                      {duplicates.length === 1 ? 'contato já existe' : 'contatos já existem'} no
                      CRM (mesmo telefone)
                    </p>
                  )}
                </div>

                {duplicates.length > 0 && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs" style={{ color: '#a8adb8' }}>
                      {skipDuplicates ? 'Pular duplicados' : 'Importar mesmo assim (duplicar)'}
                    </span>
                    <button
                      onClick={() => setSkipDuplicates(v => !v)}
                      className="relative w-9 h-5 rounded-full transition-colors shrink-0"
                      style={{ backgroundColor: skipDuplicates ? '#FF6B35' : 'rgba(242,240,235,0.15)' }}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                        style={{ transform: skipDuplicates ? 'translateX(18px)' : 'translateX(2px)' }}
                      />
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>
                    Importar para a etapa:
                  </label>
                  <select
                    value={selectedStage}
                    onChange={e => setSelectedStage(e.target.value)}
                    className="flex h-9 w-full rounded-lg border px-3 text-sm outline-none"
                    style={{
                      backgroundColor: 'rgba(242,240,235,0.06)',
                      color: '#F2F0EB',
                      borderColor: 'rgba(242,240,235,0.15)',
                    }}
                  >
                    {KANBAN_STAGES.map(s => (
                      <option key={s.id} value={s.id} style={{ backgroundColor: '#1e222b' }}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setStep('upload')
                      setError(null)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                  >
                    Voltar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    style={{ backgroundColor: '#FF6B35', color: '#fff' }}
                    onClick={handleConfirm}
                  >
                    Confirmar Importação
                  </Button>
                </div>
              </div>
            )}

            {/* ── Step 3: Result ── */}
            {step === 'result' && result && (
              <div className="space-y-4">
                <div
                  className="rounded-lg p-6 text-center space-y-2"
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.07)',
                    border: '1px solid rgba(34,197,94,0.15)',
                  }}
                >
                  <p className="text-3xl font-bold" style={{ color: '#22c55e' }}>
                    {result.imported}
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#F2F0EB' }}>
                    {result.imported === 1 ? 'contato importado' : 'contatos importados'} com
                    sucesso
                  </p>
                  {result.skipped > 0 && (
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      {result.skipped}{' '}
                      {result.skipped === 1 ? 'duplicado ignorado' : 'duplicados ignorados'}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  style={{ backgroundColor: '#FF6B35', color: '#fff' }}
                  onClick={handleClose}
                >
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
