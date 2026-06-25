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
        /*
         * Container: full-screen flex column on mobile so the dialog
         * fills the viewport. On md+ it centers the dialog with padding.
         */
        <div
          className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center md:p-4"
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

          {/* Dialog
           * mobile:  flex-1 fills remaining height, no rounding, scrollable
           * md+:     flex-none, max-width, rounded
           */}
          <motion.div
            className="relative w-full flex-1 overflow-y-auto md:flex-none md:max-w-md md:rounded-xl"
            style={{ backgroundColor: '#1a1d24', border: '1px solid rgba(242,240,235,0.1)' }}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.18 }}
          >
            <div className="p-5 md:p-6">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-lg p-1 transition-colors hover:bg-white/10"
                style={{ color: '#a8adb8' }}
              >
                <X size={16} />
              </button>

              <h2 className="text-base font-semibold mb-1 pr-6" style={{ color: '#F2F0EB' }}>
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
                rows={8}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  lineHeight: 1.6,
                  fontFamily: 'inherit',
                  minHeight: 160,
                }}
              />

              {/* Actions — stacked on mobile, row on sm+ */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#25D366', color: '#fff' }}
                >
                  <ExternalLink size={14} />
                  Abrir no WhatsApp
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
