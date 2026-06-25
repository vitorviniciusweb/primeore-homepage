'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ArrowLeft, Pencil, Trash2, Share2, FileDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Contrato } from './_types'
import { ShareModal } from './_components/ShareModal'

// ── Badges ────────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  Contrato['status'],
  { label: string; bg: string; color: string }
> = {
  Rascunho: { label: 'Rascunho', bg: 'rgba(168,173,184,0.15)', color: '#a8adb8' },
  'Aguardando Assinatura': {
    label: 'Ag. Assinatura',
    bg: 'rgba(234,179,8,0.15)',
    color: '#eab308',
  },
  Assinado: { label: 'Assinado', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Cancelado: { label: 'Cancelado', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
}

const PAGAMENTO_BADGE: Record<
  NonNullable<Contrato['statusPagamento']>,
  { label: string; bg: string; color: string }
> = {
  Pendente: { label: 'Pendente', bg: 'rgba(168,173,184,0.15)', color: '#a8adb8' },
  'Entrada Paga': { label: 'Entrada Paga', bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  Quitado: { label: 'Quitado', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
}

function StatusBadge({ status }: { status: Contrato['status'] }) {
  const cfg = STATUS_BADGE[status]
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

function PagamentoBadge({ status }: { status: Contrato['statusPagamento'] }) {
  if (!status) {
    return (
      <span
        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
        style={{ backgroundColor: 'rgba(168,173,184,0.15)', color: '#a8adb8' }}
      >
        —
      </span>
    )
  }
  const cfg = PAGAMENTO_BADGE[status]
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContratosPage() {
  const router = useRouter()
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [shareContrato, setShareContrato] = useState<Contrato | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/contracts')
      .then(r => r.json())
      .then((data: Contrato[]) => {
        setContratos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    const updated = contratos.filter(c => c.id !== id)
    setContratos(updated)
    setDeleteConfirmId(null)
    await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  async function handleDownloadPDF(id: string) {
    setDownloadingId(id)
    try {
      const res = await fetch(`/api/contracts/pdf/${id}`)
      if (!res.ok) {
        alert('Erro ao gerar PDF. Tente novamente.')
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
      setDownloadingId(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#16191F' }}>
      {/* Header — stacks on mobile, row on sm+ */}
      <header
        className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 shrink-0"
        style={{
          borderBottom: '1px solid rgba(242,240,235,0.07)',
          backgroundColor: '#1a1d24',
        }}
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
            Contratos
          </span>
        </div>

        <button
          onClick={() => router.push('/admin/contratos/novo')}
          className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-opacity hover:opacity-90 w-full sm:w-auto"
          style={{ backgroundColor: '#FF6B35', color: '#fff' }}
        >
          <Plus size={13} />
          Novo Contrato
        </button>
      </header>

      {/* Content */}
      <main className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-sm" style={{ color: '#a8adb8' }}>
              Carregando contratos...
            </span>
          </div>
        ) : contratos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-sm" style={{ color: '#a8adb8' }}>
              Nenhum contrato criado ainda.
            </span>
            <button
              onClick={() => router.push('/admin/contratos/novo')}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: '#FF6B35', color: '#fff' }}
            >
              <Plus size={14} />
              Criar primeiro contrato
            </button>
          </div>
        ) : (
          <>
            {/* ── Mobile: card list (hidden on md+) ─────────────────────────── */}
            <div className="md:hidden space-y-3">
              <AnimatePresence initial={false}>
                {contratos.map(contrato => (
                  <motion.div
                    key={contrato.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      backgroundColor: '#1a1d24',
                      border: '1px solid rgba(242,240,235,0.08)',
                    }}
                  >
                    {/* Top row: names + value */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {contrato.clientes.map(c => (
                          <p
                            key={c.id}
                            className="font-semibold text-sm leading-snug"
                            style={{ color: '#F2F0EB' }}
                          >
                            {c.nome}
                          </p>
                        ))}
                        <p className="text-xs mt-0.5" style={{ color: '#a8adb8' }}>
                          {contrato.tipoProjeto}
                        </p>
                      </div>
                      <span
                        className="text-sm font-semibold shrink-0"
                        style={{ color: '#FF6B35' }}
                      >
                        {formatCurrency(contrato.valorTotal)}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={contrato.status} />
                      <PagamentoBadge status={contrato.statusPagamento} />
                    </div>

                    {/* Actions */}
                    {deleteConfirmId === contrato.id ? (
                      <div
                        className="flex items-center gap-2 pt-1"
                        style={{ borderTop: '1px solid rgba(242,240,235,0.06)' }}
                      >
                        <span className="text-xs flex-1" style={{ color: '#a8adb8' }}>
                          Confirmar exclusão?
                        </span>
                        <button
                          onClick={() => handleDelete(contrato.id)}
                          className="text-xs font-medium px-3 py-1 rounded"
                          style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs px-3 py-1 rounded"
                          style={{ color: '#a8adb8' }}
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-1 pt-1"
                        style={{ borderTop: '1px solid rgba(242,240,235,0.06)' }}
                      >
                        <button
                          onClick={() => router.push(`/admin/contratos/${contrato.id}/editar`)}
                          title="Editar"
                          className="flex-1 flex items-center justify-center rounded-lg py-2 transition-colors hover:bg-white/10"
                          style={{ color: '#a8adb8' }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setShareContrato(contrato)}
                          title="Compartilhar"
                          className="flex-1 flex items-center justify-center rounded-lg py-2 transition-colors hover:bg-white/10"
                          style={{ color: '#3D5A80' }}
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(contrato.id)}
                          title="Download PDF"
                          disabled={downloadingId === contrato.id}
                          className="flex-1 flex items-center justify-center rounded-lg py-2 transition-colors hover:bg-white/10 disabled:opacity-40"
                          style={{ color: '#FF6B35' }}
                        >
                          <FileDown size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(contrato.id)}
                          title="Excluir"
                          className="flex-1 flex items-center justify-center rounded-lg py-2 transition-colors hover:bg-white/10"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Desktop: table (hidden on mobile) ─────────────────────────── */}
            <div
              className="hidden md:block rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(242,240,235,0.07)' }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#1a1d24', borderBottom: '1px solid rgba(242,240,235,0.07)' }}>
                    {['Cliente(s)', 'Tipo de Projeto', 'Valor Total', 'Status Contrato', 'Status Pagamento', 'Ações'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium"
                        style={{ color: '#a8adb8' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {contratos.map((contrato, idx) => (
                      <motion.tr
                        key={contrato.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                          borderBottom: '1px solid rgba(242,240,235,0.05)',
                        }}
                      >
                        {/* Cliente(s) */}
                        <td className="px-4 py-3" style={{ color: '#F2F0EB' }}>
                          <div className="flex flex-col gap-0.5">
                            {contrato.clientes.map(c => (
                              <span key={c.id} className="text-xs">
                                {c.nome}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Tipo */}
                        <td className="px-4 py-3 text-xs" style={{ color: '#F2F0EB' }}>
                          {contrato.tipoProjeto}
                        </td>

                        {/* Valor */}
                        <td className="px-4 py-3 text-xs font-medium" style={{ color: '#FF6B35' }}>
                          {formatCurrency(contrato.valorTotal)}
                        </td>

                        {/* Status contrato */}
                        <td className="px-4 py-3">
                          <StatusBadge status={contrato.status} />
                        </td>

                        {/* Status pagamento */}
                        <td className="px-4 py-3">
                          <PagamentoBadge status={contrato.statusPagamento} />
                        </td>

                        {/* Ações */}
                        <td className="px-4 py-3">
                          {deleteConfirmId === contrato.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs" style={{ color: '#a8adb8' }}>
                                Confirmar?
                              </span>
                              <button
                                onClick={() => handleDelete(contrato.id)}
                                className="text-xs font-medium px-2 py-1 rounded"
                                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                              >
                                Sim
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs px-2 py-1 rounded"
                                style={{ color: '#a8adb8' }}
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/admin/contratos/${contrato.id}/editar`)}
                                title="Editar"
                                className="rounded-lg p-1.5 transition-colors hover:opacity-80"
                                style={{ color: '#a8adb8' }}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setShareContrato(contrato)}
                                title="Compartilhar"
                                className="rounded-lg p-1.5 transition-colors hover:opacity-80"
                                style={{ color: '#3D5A80' }}
                              >
                                <Share2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(contrato.id)}
                                title="Download PDF"
                                disabled={downloadingId === contrato.id}
                                className="rounded-lg p-1.5 transition-colors hover:opacity-80 disabled:opacity-40"
                                style={{ color: '#FF6B35' }}
                              >
                                <FileDown size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(contrato.id)}
                                title="Excluir"
                                className="rounded-lg p-1.5 transition-colors hover:opacity-80"
                                style={{ color: '#ef4444' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Share Modal */}
      {shareContrato && (
        <ShareModal
          contrato={shareContrato}
          open={!!shareContrato}
          onClose={() => setShareContrato(null)}
        />
      )}
    </div>
  )
}
