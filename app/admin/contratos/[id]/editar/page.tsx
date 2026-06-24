'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, FileDown } from 'lucide-react'
import Link from 'next/link'
import type { Contrato, ClienteParte, Secao } from '../../_types'

// ── Styles ────────────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors placeholder:opacity-40'
const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(242,240,235,0.12)',
  color: '#F2F0EB',
}
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 500,
  color: '#a8adb8',
  marginBottom: 4,
}
const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#F2F0EB',
  marginBottom: 12,
}
const sectionStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(242,240,235,0.07)',
  borderRadius: 12,
  padding: '20px 20px',
  marginBottom: 16,
}

function generateId() {
  return crypto.randomUUID()
}

function emptyCliente(): ClienteParte {
  return { id: generateId(), tipo: 'CPF', nome: '', documento: '', email: '', whatsapp: '' }
}

function emptySecao(): Secao {
  return { id: generateId(), nome: '', descricao: '' }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditarContratoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [notFound, setNotFound] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Form state
  const [clientes, setClientes] = useState<ClienteParte[]>([emptyCliente()])
  const [tipoProjeto, setTipoProjeto] = useState<Contrato['tipoProjeto']>('Presença Profissional')
  const [secoes, setSecoes] = useState<Secao[]>([emptySecao()])
  const [valorTotal, setValorTotal] = useState('')
  const [valorEntrada, setValorEntrada] = useState('')
  const [valorEntrega, setValorEntrega] = useState('')
  const [dataAssinatura, setDataAssinatura] = useState('')
  const [status, setStatus] = useState<Contrato['status']>('Rascunho')
  const [statusPagamento, setStatusPagamento] = useState<NonNullable<Contrato['statusPagamento']>>('Pendente')
  const [linkClickSign, setLinkClickSign] = useState('')
  const [linkAsaas, setLinkAsaas] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const total = parseFloat(valorTotal.replace(',', '.') || '0')
    const entrada = parseFloat(valorEntrada.replace(',', '.') || '0')
    if (valorTotal === '' && valorEntrada === '') {
      setValorEntrega('')
      return
    }
    setValorEntrega(isNaN(total - entrada) ? '' : String(total - entrada))
  }, [valorTotal, valorEntrada])

  // Load contract on mount
  useEffect(() => {
    fetch('/api/contracts')
      .then(r => r.json())
      .then((data: Contrato[]) => {
        const contrato = (Array.isArray(data) ? data : []).find(c => c.id === id)
        if (!contrato) {
          setNotFound(true)
          return
        }
        setClientes(contrato.clientes)
        setTipoProjeto(contrato.tipoProjeto)
        setSecoes(contrato.secoes)
        setValorTotal(String(contrato.valorTotal))
        setValorEntrada(String(contrato.valorEntrada))
        setDataAssinatura(contrato.dataAssinatura)
        setStatus(contrato.status)
        setStatusPagamento(contrato.statusPagamento ?? 'Pendente')
        setLinkClickSign(contrato.linkClickSign ?? '')
        setLinkAsaas(contrato.linkAsaas ?? '')
        setLoadingData(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoadingData(false)
      })
  }, [id])

  // ── Clientes ──────────────────────────────────────────────────────────────

  function updateCliente(cid: string, field: keyof ClienteParte, value: string) {
    setClientes(prev => prev.map(c => (c.id === cid ? { ...c, [field]: value } : c)))
  }

  function removeCliente(cid: string) {
    if (clientes.length === 1) return
    setClientes(prev => prev.filter(c => c.id !== cid))
  }

  // ── Seções ────────────────────────────────────────────────────────────────

  function updateSecao(sid: string, field: keyof Secao, value: string) {
    setSecoes(prev => prev.map(s => (s.id === sid ? { ...s, [field]: value } : s)))
  }

  function removeSecao(sid: string) {
    if (secoes.length === 1) return
    setSecoes(prev => prev.filter(s => s.id !== sid))
  }

  // ── Validate ──────────────────────────────────────────────────────────────

  function validate(): string | null {
    for (const c of clientes) {
      if (!c.nome.trim()) return 'Nome do cliente é obrigatório.'
      if (!c.documento.trim()) return 'Número do documento é obrigatório.'
      if (!c.email.trim()) return 'E-mail do cliente é obrigatório.'
      if (!c.whatsapp.trim()) return 'WhatsApp do cliente é obrigatório.'
    }
    for (const s of secoes) {
      if (!s.nome.trim()) return 'Nome da seção é obrigatório.'
    }
    const total = parseFloat(valorTotal.replace(',', '.') || '0')
    const entrada = parseFloat(valorEntrada.replace(',', '.') || '0')
    if (!total || total <= 0) return 'Valor total deve ser maior que zero.'
    if (!entrada || entrada <= 0) return 'Valor de entrada deve ser maior que zero.'
    if (entrada > total) return 'Valor de entrada não pode ser maior que o valor total.'
    if (!dataAssinatura) return 'Data de assinatura é obrigatória.'
    return null
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)

    try {
      const total = parseFloat(valorTotal.replace(',', '.'))
      const entrada = parseFloat(valorEntrada.replace(',', '.'))
      const entrega = total - entrada

      const updated: Contrato = {
        id,
        clientes,
        tipoProjeto,
        secoes,
        valorTotal: total,
        valorEntrada: entrada,
        valorEntrega: entrega,
        dataAssinatura,
        status,
        statusPagamento,
        linkClickSign: linkClickSign || undefined,
        linkAsaas: linkAsaas || undefined,
        createdAt: new Date().toISOString(),
      }

      const existingRes = await fetch('/api/contracts')
      const existing: Contrato[] = existingRes.ok ? await existingRes.json() : []
      const all = (Array.isArray(existing) ? existing : []).map(c =>
        c.id === id ? updated : c,
      )

      const saveRes = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(all),
      })

      if (!saveRes.ok) throw new Error('Falha ao salvar.')

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  // ── Download PDF ──────────────────────────────────────────────────────────

  async function handleDownloadPDF() {
    setDownloadingPDF(true)
    try {
      const res = await fetch(`/api/contracts/pdf/${id}`)
      if (!res.ok) {
        alert('Erro ao gerar PDF. Salve o contrato e tente novamente.')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contrato-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloadingPDF(false)
    }
  }

  // ── Loading / Not Found ───────────────────────────────────────────────────

  if (loadingData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#16191F' }}
      >
        <span className="text-sm" style={{ color: '#a8adb8' }}>
          Carregando contrato...
        </span>
      </div>
    )
  }

  if (notFound) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: '#16191F' }}
      >
        <span className="text-sm" style={{ color: '#a8adb8' }}>
          Contrato não encontrado.
        </span>
        <Link
          href="/admin/contratos"
          className="text-sm"
          style={{ color: '#FF6B35' }}
        >
          ← Voltar
        </Link>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#16191F' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid rgba(242,240,235,0.07)', backgroundColor: '#1a1d24' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contratos"
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
            style={{ color: '#a8adb8' }}
          >
            <ArrowLeft size={13} />
            Contratos
          </Link>
          <span style={{ color: 'rgba(242,240,235,0.2)' }}>·</span>
          <span className="font-semibold text-sm" style={{ color: '#F2F0EB' }}>
            Editar Contrato
          </span>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#FF6B35' }}
        >
          <FileDown size={13} />
          {downloadingPDF ? 'Gerando...' : 'Download PDF'}
        </button>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Clientes */}
        <div style={sectionStyle}>
          <div className="flex items-center justify-between mb-4">
            <p style={sectionTitleStyle}>Clientes</p>
            <button
              onClick={() => setClientes(prev => [...prev, emptyCliente()])}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#FF6B35' }}
            >
              <Plus size={12} />
              Adicionar Cliente
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {clientes.map((cliente, idx) => (
              <div
                key={cliente.id}
                className="rounded-lg p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(242,240,235,0.06)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: '#a8adb8' }}>
                    Cliente {idx + 1}
                  </span>
                  {clientes.length > 1 && (
                    <button
                      onClick={() => removeCliente(cliente.id)}
                      className="rounded p-0.5 transition-opacity hover:opacity-70"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={labelStyle}>Tipo</label>
                    <select
                      value={cliente.tipo}
                      onChange={e => updateCliente(cliente.id, 'tipo', e.target.value)}
                      className={inputCls}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="CPF" style={{ backgroundColor: '#1a1d24' }}>CPF</option>
                      <option value="CNPJ" style={{ backgroundColor: '#1a1d24' }}>CNPJ</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Nº do Documento *</label>
                    <input
                      type="text"
                      value={cliente.documento}
                      onChange={e => updateCliente(cliente.id, 'documento', e.target.value)}
                      placeholder={cliente.tipo === 'CPF' ? '000.000.000-00' : '00.000.000/0001-00'}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div className="col-span-2">
                    <label style={labelStyle}>Nome Completo *</label>
                    <input
                      type="text"
                      value={cliente.nome}
                      onChange={e => updateCliente(cliente.id, 'nome', e.target.value)}
                      placeholder="Nome do cliente"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail *</label>
                    <input
                      type="email"
                      value={cliente.email}
                      onChange={e => updateCliente(cliente.id, 'email', e.target.value)}
                      placeholder="email@exemplo.com"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp *</label>
                    <input
                      type="text"
                      value={cliente.whatsapp}
                      onChange={e => updateCliente(cliente.id, 'whatsapp', e.target.value)}
                      placeholder="(13) 99999-0000"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projeto */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Projeto</p>
          <div>
            <label style={labelStyle}>Tipo de Projeto</label>
            <select
              value={tipoProjeto}
              onChange={e => setTipoProjeto(e.target.value as Contrato['tipoProjeto'])}
              className={inputCls}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="Presença Profissional" style={{ backgroundColor: '#1a1d24' }}>
                Presença Profissional
              </option>
              <option value="Projeto Sob Medida" style={{ backgroundColor: '#1a1d24' }}>
                Projeto Sob Medida
              </option>
            </select>
          </div>
        </div>

        {/* Seções */}
        <div style={sectionStyle}>
          <div className="flex items-center justify-between mb-4">
            <p style={sectionTitleStyle}>Seções Incluídas</p>
            <button
              onClick={() => setSecoes(prev => [...prev, emptySecao()])}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#FF6B35' }}
            >
              <Plus size={12} />
              Adicionar Seção
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {secoes.map((secao, idx) => (
              <div key={secao.id} className="flex items-start gap-2">
                <span
                  className="mt-2 text-xs font-medium w-5 shrink-0 text-center"
                  style={{ color: '#a8adb8' }}
                >
                  {idx + 1}.
                </span>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label style={labelStyle}>Nome da Seção *</label>
                    <input
                      type="text"
                      value={secao.nome}
                      onChange={e => updateSecao(secao.id, 'nome', e.target.value)}
                      placeholder="Ex: Landing Page"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Descrição</label>
                    <input
                      type="text"
                      value={secao.descricao}
                      onChange={e => updateSecao(secao.id, 'descricao', e.target.value)}
                      placeholder="Breve descrição"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
                {secoes.length > 1 && (
                  <button
                    onClick={() => removeSecao(secao.id)}
                    className="mt-6 rounded p-1 transition-opacity hover:opacity-70"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Valores */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Valores</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={labelStyle}>Valor Total (R$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorTotal}
                onChange={e => setValorTotal(e.target.value)}
                placeholder="0,00"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Valor de Entrada (R$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorEntrada}
                onChange={e => setValorEntrada(e.target.value)}
                placeholder="0,00"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Valor de Entrega (R$) — calculado</label>
              <input
                type="text"
                disabled
                value={
                  valorEntrega === ''
                    ? ''
                    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        parseFloat(valorEntrega),
                      )
                }
                placeholder="—"
                className={inputCls}
                style={{
                  ...inputStyle,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: parseFloat(valorEntrega) >= 0 && valorEntrega !== '' ? '#22c55e' : '#ef4444',
                  cursor: 'not-allowed',
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        </div>

        {/* Data */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Data de Assinatura</p>
          <div className="max-w-xs">
            <input
              type="date"
              value={dataAssinatura}
              onChange={e => setDataAssinatura(e.target.value)}
              className={inputCls}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
          </div>
        </div>

        {/* Extra fields — only in edit */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Links e Status</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Link ClickSign</label>
              <input
                type="text"
                value={linkClickSign}
                onChange={e => setLinkClickSign(e.target.value)}
                placeholder="https://app.clicksign.com/..."
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Link Asaas</label>
              <input
                type="text"
                value={linkAsaas}
                onChange={e => setLinkAsaas(e.target.value)}
                placeholder="https://www.asaas.com/..."
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Status do Contrato</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Contrato['status'])}
                className={inputCls}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {(['Rascunho', 'Aguardando Assinatura', 'Assinado', 'Cancelado'] as const).map(s => (
                  <option key={s} value={s} style={{ backgroundColor: '#1a1d24' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status do Pagamento</label>
              <select
                value={statusPagamento}
                onChange={e => setStatusPagamento(e.target.value as NonNullable<Contrato['statusPagamento']>)}
                className={inputCls}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {(['Pendente', 'Entrada Paga', 'Quitado'] as const).map(s => (
                  <option key={s} value={s} style={{ backgroundColor: '#1a1d24' }}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm mb-4"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </div>
        )}

        {saved && (
          <div
            className="rounded-lg px-4 py-3 text-sm mb-4"
            style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
          >
            Contrato salvo com sucesso!
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/contratos"
            className="rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#a8adb8' }}
          >
            Voltar
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#FF6B35', color: '#fff' }}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </main>
    </div>
  )
}
