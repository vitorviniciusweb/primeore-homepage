'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Plus, LogOut, Cloud, CloudOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Contact, Temperature } from './_types'
import { COLUMNS, INITIAL_CONTACTS } from './_data'
import { KanbanColumn } from './_components/KanbanColumn'
import { ContactModal } from './_components/ContactModal'
import { LostModal } from './_components/LostModal'

const STORAGE_KEY = 'primeore_contacts'
const TEMP_ORDER: Record<Temperature, number> = { quente: 0, morno: 1, frio: 2 }

type SyncStatus = 'synced' | 'syncing' | 'offline'

function sortByTemp(list: Contact[]): Contact[] {
  return [...list].sort(
    (a, b) => TEMP_ORDER[a.temperature ?? 'morno'] - TEMP_ORDER[b.temperature ?? 'morno'],
  )
}

function backfill(list: Contact[]): Contact[] {
  return list.map(c => ({ ...c, temperature: (c.temperature ?? 'morno') as Temperature }))
}

function loadFromStorage(): Contact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return backfill(JSON.parse(raw) as Contact[])
  } catch {}
  return INITIAL_CONTACTS
}

function saveToStorage(contacts: Contact[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  } catch {}
}

type LostPending = { contactId: string }

export default function AdminPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [lostPending, setLostPending] = useState<LostPending | null>(null)

  // When true, the next run of the persist effect skips the Redis POST
  // (used after we just loaded data FROM Redis — no need to echo it back)
  const skipNextSync = useRef(false)

  // ── Initial load: Redis first, localStorage as fallback ──
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/contacts')
        if (res.ok) {
          const data = (await res.json()) as Contact[]
          if (Array.isArray(data) && data.length > 0) {
            skipNextSync.current = true
            setContacts(backfill(data))
            setSyncStatus('synced')
            setHydrated(true)
            return
          }
        } else {
          const body = await res.text()
          console.error('[Contacts fetch failed]', res.status, body)
        }
      } catch (error) {
        console.error('[Contacts fetch error]', error)
      }

      // Fallback: localStorage (and let the persist effect sync it to Redis)
      setSyncStatus('offline')
      setContacts(loadFromStorage())
      setHydrated(true)
    }

    load()
  }, [])

  // ── Persist on every contacts change ──
  useEffect(() => {
    if (!hydrated) return

    // Always keep localStorage in sync as offline fallback
    saveToStorage(contacts)

    // Skip the POST right after the initial Redis load
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }

    setSyncStatus('syncing')
    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacts),
    })
      .then(r => setSyncStatus(r.ok ? 'synced' : 'offline'))
      .catch(() => setSyncStatus('offline'))
  }, [contacts, hydrated])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  function moveContact(id: string, dstCol: string, lostReason?: string) {
    setContacts(prev =>
      prev.map(c =>
        c.id !== id
          ? c
          : {
              ...c,
              status: dstCol,
              lostReason: dstCol === 'Perdido' ? (lostReason ?? c.lostReason) : undefined,
            },
      ),
    )
  }

  function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    if (destination.droppableId === 'Perdido') {
      setLostPending({ contactId: draggableId })
      return
    }

    moveContact(draggableId, destination.droppableId)
  }

  function handleLostConfirm(reason: string) {
    if (!lostPending) return
    moveContact(lostPending.contactId, 'Perdido', reason)
    setLostPending(null)
  }

  function handleSave(contact: Contact) {
    setContacts(prev => {
      const idx = prev.findIndex(c => c.id === contact.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = contact
        return next
      }
      return [contact, ...prev]
    })
  }

  function handleDelete(id: string) {
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  function openEdit(c: Contact) {
    setEditingContact(c)
    setModalOpen(true)
  }

  function openNew() {
    setEditingContact(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingContact(null)
  }

  if (!hydrated) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#16191F' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{
          borderBottom: '1px solid rgba(242,240,235,0.07)',
          backgroundColor: '#1a1d24',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-base" style={{ color: '#F2F0EB' }}>
            Primeore CRM
          </span>
          <SyncIndicator status={syncStatus} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={openNew}
            className="gap-1.5 text-xs"
            style={{ backgroundColor: '#FF6B35', color: '#fff' }}
          >
            <Plus size={13} />
            Novo contato
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs"
            style={{ color: '#a8adb8' }}
          >
            <LogOut size={13} />
            Sair
          </Button>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            className="flex gap-3 p-4 h-full"
            style={{ width: 'max-content', minHeight: 'calc(100vh - 49px)' }}
          >
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                contacts={sortByTemp(contacts.filter(c => c.status === col.id))}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <ContactModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={editingContact ? () => handleDelete(editingContact.id) : undefined}
        initial={editingContact}
      />

      <LostModal
        open={!!lostPending}
        onConfirm={handleLostConfirm}
        onCancel={() => setLostPending(null)}
      />
    </div>
  )
}

function SyncIndicator({ status }: { status: SyncStatus }) {
  if (status === 'syncing') {
    return (
      <span title="Sincronizando...">
        <Cloud
          size={14}
          className="animate-spin"
          style={{ color: '#a8adb8' }}
        />
      </span>
    )
  }
  if (status === 'synced') {
    return (
      <span title="Sincronizado com Redis">
        <Cloud size={14} style={{ color: '#22c55e' }} />
      </span>
    )
  }
  return (
    <span title="Offline — usando localStorage">
      <CloudOff size={14} style={{ color: '#a8adb8' }} />
    </span>
  )
}
