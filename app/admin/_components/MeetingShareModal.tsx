'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X, ExternalLink, Copy, Check } from 'lucide-react'
import { phoneDigits } from '../_activity-utils'

type Props = {
  open: boolean
  onClose: () => void
  contactName: string
  contactPhone?: string
  scheduledFor: string
  meetingLink: string
}

function formatMeetingDateTime(iso: string): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function buildWhatsAppMessage(name: string, when: string, link: string): string {
  return `Olá, ${name}! 😊\nPassando para confirmar nossa reunião online agendada para ${when}.\n🔗 Link de acesso: ${link}\nQualquer dúvida, estou à disposição!`
}

function buildEmailMessage(name: string, when: string, link: string): string {
  return `Assunto: Confirmação de Reunião — Primeore\n\nOlá, ${name},\n\nConfirmo nossa reunião online agendada para ${when}.\nLink de acesso: ${link}\n\nQualquer dúvida, entre em contato.\n\nAtenciosamente,\nVitor Vinícius\nPrimeore | primeore.com.br\n(13) 97810-9003`
}

const textareaStyle: React.CSSProperties = {
  backgroundColor: 'rgba(242,240,235,0.06)',
  border: '1px solid rgba(242,240,235,0.15)',
  color: '#F2F0EB',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 12.5,
  lineHeight: 1.6,
  width: '100%',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
}

export function MeetingShareModal({ open, onClose, contactName, contactPhone, scheduledFor, meetingLink }: Props) {
  const [whatsappMsg, setWhatsappMsg] = useState('')
  const [emailMsg, setEmailMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    const when = formatMeetingDateTime(scheduledFor)
    setWhatsappMsg(buildWhatsAppMessage(contactName, when, meetingLink))
    setEmailMsg(buildEmailMessage(contactName, when, meetingLink))
    setCopied(false)
  }, [open, contactName, scheduledFor, meetingLink])

  const digits = contactPhone ? phoneDigits(contactPhone) : ''
  const hasPhone = digits.length >= 10

  function handleWhatsApp() {
    if (!hasPhone) return
    window.open(`https://wa.me/55${digits}?text=${encodeURIComponent(whatsappMsg)}`, '_blank')
  }

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(emailMsg)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
          }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed', zIndex: 70,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '96vw',
            maxWidth: '32rem',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(242,240,235,0.08)' }}
          >
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              Compartilhar reunião
            </Dialog.Title>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X size={15} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>
                Mensagem WhatsApp
              </label>
              <textarea
                value={whatsappMsg}
                onChange={e => setWhatsappMsg(e.target.value)}
                rows={5}
                style={textareaStyle}
              />
              <button
                onClick={handleWhatsApp}
                disabled={!hasPhone}
                title={!hasPhone ? 'Contato sem telefone cadastrado' : undefined}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#25D366', color: '#fff' }}
              >
                <ExternalLink size={14} />
                Enviar pelo WhatsApp
              </button>
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium" style={{ color: '#a8adb8' }}>
                Mensagem E-mail (copiar e enviar manualmente)
              </label>
              <textarea
                value={emailMsg}
                onChange={e => setEmailMsg(e.target.value)}
                rows={8}
                style={textareaStyle}
              />
              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(242,240,235,0.12)',
                  color: copied ? '#22c55e' : '#F2F0EB',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copiado!' : 'Copiar mensagem de e-mail'}
              </button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
