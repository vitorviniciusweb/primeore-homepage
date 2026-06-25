'use client'

import { useState, useEffect } from 'react'
import { X, Copy, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Briefing } from '../_types'

type Props = {
  contactId: string
  contactName: string
  open: boolean
  onClose: () => void
}

type Section = {
  title: string
  fields: { label: string; value: string | undefined }[]
}

function buildSections(r: Briefing['respostas']): Section[] {
  return [
    {
      title: 'Sobre o Negócio',
      fields: [
        { label: 'Nome da empresa / profissional', value: r.nomeEmpresa },
        { label: 'Segmento de atuação', value: r.segmento },
        { label: 'Tempo no mercado', value: r.tempoMercado },
        { label: 'Serviços / produtos', value: r.servicosProdutos },
        { label: 'Diferencial', value: r.diferencial },
        { label: 'Cidade e bairro', value: r.cidadeBairro },
      ],
    },
    {
      title: 'Sobre o Cliente Ideal',
      fields: [
        { label: 'Perfil do cliente ideal', value: r.clienteIdeal },
        { label: 'Problema que resolve', value: r.problemaResolvido },
      ],
    },
    {
      title: 'Sobre o Site',
      fields: [
        { label: 'Objetivo principal', value: r.objetivoPrincipal },
        { label: 'Referências visuais', value: r.referenciasVisuais },
        { label: 'Preferência de cores', value: r.preferenciaCores },
      ],
    },
    {
      title: 'Contatos e Redes',
      fields: [
        { label: 'WhatsApp do negócio', value: r.whatsappNegocio },
        { label: 'E-mail de contato', value: r.emailContato },
        { label: 'Endereço físico', value: r.enderecoFisico },
        { label: 'Redes sociais', value: r.redesSociais },
      ],
    },
    {
      title: 'Arquivos',
      fields: [
        { label: 'Tem logo?', value: r.temLogo },
        { label: 'Tem fotos profissionais?', value: r.temFotos },
      ],
    },
  ]
}

export function BriefingModal({ contactId, contactName, open, onClose }: Props) {
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setBriefing(null)
    setError('')
    setLoading(true)

    fetch(`/api/briefing/${contactId}`)
      .then(r => r.json())
      .then((data: Briefing | null) => {
        if (data) setBriefing(data)
        else setError('Briefing não encontrado.')
      })
      .catch(() => setError('Erro ao carregar o briefing.'))
      .finally(() => setLoading(false))
  }, [open, contactId])

  async function handleCopyLink() {
    const url = `https://primeore.com.br/briefing/${contactId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full z-10 rounded-xl overflow-hidden"
            style={{
              maxWidth: '700px',
              maxHeight: '90vh',
              backgroundColor: '#1a1d24',
              border: '1px solid rgba(242,240,235,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
            }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
            >
              <div>
                <h2 className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
                  Pré-Briefing — {contactName}
                </h2>
                {briefing && (
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                    Preenchido em {formatDate(briefing.preenchidoEm)}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={15} style={{ color: '#a8adb8' }} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div
                    className="w-5 h-5 rounded-full border-2 animate-spin"
                    style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-center py-12" style={{ color: '#a8adb8' }}>
                  {error}
                </p>
              )}

              {briefing && (
                <div className="space-y-7">
                  {buildSections(briefing.respostas).map(section => (
                    <div key={section.title}>
                      <div className="mb-3">
                        <h3
                          className="text-xs font-semibold uppercase tracking-widest mb-2"
                          style={{ color: '#FF6B35' }}
                        >
                          {section.title}
                        </h3>
                        <div style={{ height: 1, backgroundColor: 'rgba(255,107,53,0.2)' }} />
                      </div>
                      <div className="space-y-3">
                        {section.fields.map(field => (
                          <div key={field.label} className="flex flex-col gap-0.5">
                            <span className="text-xs" style={{ color: '#6b7280' }}>
                              {field.label}
                            </span>
                            <span
                              className="text-sm whitespace-pre-wrap"
                              style={{ color: field.value ? '#F2F0EB' : '#4b5563' }}
                            >
                              {field.value || '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between gap-3 px-5 py-4 shrink-0"
              style={{ borderTop: '1px solid rgba(242,240,235,0.08)' }}
            >
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-white/10"
                style={{
                  border: '1px solid rgba(242,240,235,0.12)',
                  color: copied ? '#22c55e' : '#a8adb8',
                }}
              >
                {copied ? (
                  <>
                    <Copy size={12} />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <ExternalLink size={12} />
                    Copiar link
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium transition-colors hover:bg-white/10"
                style={{
                  border: '1px solid rgba(242,240,235,0.12)',
                  color: '#F2F0EB',
                }}
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
