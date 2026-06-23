'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function LostModal({ open, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) setReason('')
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onCancel()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }}
        />
        <Dialog.Popup
          style={{
            position: 'fixed',
            zIndex: 70,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '100%',
            maxWidth: '24rem',
            backgroundColor: '#1e222b',
            border: '1px solid rgba(242,240,235,0.1)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-sm font-semibold" style={{ color: '#F2F0EB' }}>
              Motivo da perda
            </Dialog.Title>
            <button
              onClick={onCancel}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X size={14} style={{ color: '#a8adb8' }} />
            </button>
          </div>

          <p className="text-xs mb-3" style={{ color: '#a8adb8' }}>
            Registre o motivo com precisão para identificar padrões no seu processo.
          </p>

          <textarea
            autoFocus
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Ex: Achou caro, fechou com concorrente, sem urgência..."
            className="flex w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
            style={{
              backgroundColor: 'rgba(242,240,235,0.06)',
              color: '#F2F0EB',
              borderColor: 'rgba(242,240,235,0.15)',
            }}
          />

          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => onConfirm(reason)}
              style={{ backgroundColor: '#FF6B35', color: '#fff' }}
            >
              Confirmar
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
