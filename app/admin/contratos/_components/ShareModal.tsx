'use client'

import { useState, useEffect } from 'react'
import { X, Copy, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Contrato, ClienteParte } from '../_types'

type Props = {
  contrato: Contrato
  open: boolean
  onClose: () => void
}

function buildMessage(contrato: Contrato, cliente: ClienteParte): string {
  const clickSign = contrato.linkClickSign || 'link não cadastrado'
  const asaas = contrato.linkAsaas || 'link não cadastrado'
  return `Olá, ${cliente.nome}! Segue o contrato referente ao seu projeto ${contrato.tipoProjeto} com a Primeore.\n\n📄 Assine aqui: ${clickSign}\n💳 Realize o pagamento: ${asaas}\n\nQualquer dúvida, estou à disposição!`
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(242,240,235,0.12)',
  color: '#F2F0EB',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
}

export function ShareModal({ contrato, open, onClose }: Props) {
  const [selectedClienteId, setSelectedClienteId] = useState<string>(
    contrato.clientes[0]?.id ?? '',
  )
  const selectedCliente =
    contrato.clientes.find(c => c.id === selectedClienteId) ?? contrato.clientes[0]

  const [message, setMessage] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (selectedCliente) {
      setMessage(buildMessage(contrato, selectedCliente))
    }
  }, [selectedClienteId, contrato, selectedCliente])

  function handleWhatsApp() {
    if (!selectedCliente) return
    const digits = selectedCliente.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${digits}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
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
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-md rounded-xl p-6 z-10"
            style={{ backgroundColor: '#1a1d24', border: '1px solid rgba(242,240,235,0.1)' }}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-lg p-1 transition-colors"
              style={{ color: '#a8adb8' }}
            >
              <X size={16} />
            </button>

            <h2 className="text-base font-semibold mb-1" style={{ color: '#F2F0EB' }}>
              Compartilhar Contrato
            </h2>
            <p className="text-xs mb-5" style={{ color: '#a8adb8' }}>
              Envie os links de assinatura e pagamento via WhatsApp.
            </p>

            {/* Select cliente */}
            <label className="block mb-1 text-xs font-medium" style={{ color: '#a8adb8' }}>
              Enviar para
            </label>
            <select
              value={selectedClienteId}
              onChange={e => setSelectedClienteId(e.target.value)}
              style={{ ...inputStyle, marginBottom: 16, appearance: 'none', cursor: 'pointer' }}
            >
              {contrato.clientes.map(c => (
                <option key={c.id} value={c.id} style={{ backgroundColor: '#1a1d24' }}>
                  {c.nome} — {c.whatsapp}
                </option>
              ))}
            </select>

            {/* Message preview */}
            <label className="block mb-1 text-xs font-medium" style={{ color: '#a8adb8' }}>
              Mensagem (editável)
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={7}
              style={{
                ...inputStyle,
                resize: 'vertical',
                lineHeight: 1.6,
                fontFamily: 'inherit',
              }}
            />

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#25D366', color: '#fff' }}
              >
                <ExternalLink size={14} />
                Abrir no WhatsApp
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(242,240,235,0.12)',
                  color: copied ? '#22c55e' : '#F2F0EB',
                }}
              >
                <Copy size={14} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
