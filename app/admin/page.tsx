'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Plus, LogOut, Cloud, CloudOff, FileText, FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Contact, Temperature, Activity } from './_types'
import { COLUMNS, INITIAL_CONTACTS } from './_data'
import { KanbanColumn } from './_components/KanbanColumn'
import { ContactModal } from './_components/ContactModal'
import { LostModal } from './_components/LostModal'
import { BriefingModal } from './_components/BriefingModal'
import { ImportModal } from './_components/ImportModal'
import { FilterBar, emptyFilters, applyFilters, type FilterState } from './_components/FilterBar'

const STORAGE_KEY = 'primeore_contacts'
const COL_SORTS_KEY = 'primeore_col_sorts'
const TEMP_ORDER: Record<Temperature, number> = { quente: 0, morno: 1, frio: 2 }

type SyncStatus = 'synced' | 'syncing' | 'offline'
type ColSort = 'temperatura' | 'agenda'

function sortByTemp(list: Contact[]): Contact[] {
  return [...list].sort(
    (a, b) => TEMP_ORDER[a.temperature ?? 'morno'] - TEMP_ORDER[b.temperature ?? 'morno'],
  )
}

function sortByAgenda(
  list: Contact[],
  activitySummary: Record<string, { scheduledFor: string; overdue: boolean } | null>,
): Contact[] {
  return [...list].sort((a, b) => {
    const sa = activitySummary[a.id]
    const sb = activitySummary[b.id]
    // Grupo 1: ambos com atividade → mais próximo primeiro (vencidos sobem pois data menor)
    if (sa && sb) return sa.scheduledFor.localeCompare(sb.scheduledFor)
    if (sa) return -1
    if (sb) return 1
    // Grupo 2: sem atividade → último contato DESC (mais recente primeiro, null por último)
    const la = a.lastContact
    const lb = b.lastContact
    if (la && lb) return lb.localeCompare(la)
    if (la) return -1
    if (lb) return 1
    return 0
  })
}

function migrateNicho(c: Contact): Contact {
  if (c.nicho) return c
  const hasImportFields = !!(
    c.linkMaps || c.statusSite || c.bairro || c.categoria ||
    c.linkSocial || c.nota !== undefined || c.avaliacoes !== undefined
  )
  if (c.company && hasImportFields) {
    return { ...c, nicho: c.company, company: '' }
  }
  return c
}

function backfill(list: Contact[]): Contact[] {
  return list.map(c => {
    const raw = c as Contact & { service?: string }
    return migrateNicho({
      ...c,
      temperature: (c.temperature ?? 'morno') as Temperature,
      services: c.services ?? (raw.service ? [raw.service] : []),
    })
  })
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

  const [briefingStatus, setBriefingStatus] = useState<Record<string, boolean>>({})
  const [briefingContact, setBriefingContact] = useState<Contact | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const briefingFetched = useRef(false)

  const [importOpen, setImportOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(emptyFilters())
  const [colSorts, setColSorts] = useState<Record<string, ColSort>>({})
  const [activityDates, setActivityDates] = useState<Record<string, { scheduledFor: string; overdue: boolean } | null>>({})

  // When true, the next run of the persist effect skips the Redis POST
  // (used after we just loaded data FROM Redis — no need to echo it back)
  const skipNextSync = useRef(false)

  // ── Load persisted column sorts from localStorage ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(COL_SORTS_KEY)
      if (raw) setColSorts(JSON.parse(raw) as Record<string, ColSort>)
    } catch {}
  }, [])

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

  // ── Load activity summaries for all contacts once after hydration ──
  useEffect(() => {
    if (!hydrated || contacts.length === 0) return
    const ids = contacts.map(c => c.id).join(',')
    fetch(`/api/activities/summary?ids=${ids}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {
          setActivityDates(prev => ({ ...prev, ...data }))
        }
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  // ── Fetch briefing status for "Fechado" contacts (once after hydration) ──
  useEffect(() => {
    if (!hydrated || briefingFetched.current) return
    briefingFetched.current = true

    const fechados = contacts.filter(c => c.status === 'Fechado')
    if (fechados.length === 0) return

    Promise.all(
      fechados.map(c =>
        fetch(`/api/briefing/${c.id}`)
          .then(r => r.json())
          .then(data => ({ id: c.id, filled: data !== null }))
          .catch(() => ({ id: c.id, filled: false })),
      ),
    ).then(results => {
      const next: Record<string, boolean> = {}
      results.forEach(r => { next[r.id] = r.filled })
      setBriefingStatus(next)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

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

  async function loadActivityDatesForColumn(colContacts: Contact[]) {
    const now = new Date()
    const results = await Promise.all(
      colContacts.map(c =>
        fetch(`/api/activities/${c.id}`)
          .then(r => r.json() as Promise<Activity[]>)
          .then(list => {
            const pending = (Array.isArray(list) ? list : []).filter(a => !a.completed)
            if (pending.length === 0) return { id: c.id, summary: null }
            const next = pending.reduce((a, b) => a.scheduledFor < b.scheduledFor ? a : b)
            return {
              id: c.id,
              summary: {
                scheduledFor: next.scheduledFor,
                overdue: new Date(next.scheduledFor) < now,
              },
            }
          })
          .catch(() => ({ id: c.id, summary: null })),
      ),
    )
    setActivityDates(prev => {
      const next = { ...prev }
      results.forEach(r => { next[r.id] = r.summary })
      return next
    })
  }

  function handleSortChange(colId: string, sort: ColSort) {
    const next = { ...colSorts, [colId]: sort }
    setColSorts(next)
    try { localStorage.setItem(COL_SORTS_KEY, JSON.stringify(next)) } catch {}
    if (sort === 'agenda') {
      loadActivityDatesForColumn(contacts.filter(c => c.status === colId))
    }
  }

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

  function handleImport(newContacts: Contact[]) {
    setContacts(prev => [...newContacts, ...prev])
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

  function handleCopyBriefingLink(c: Contact) {
    const url = `https://primeore.com.br/briefing/${c.id}`
    navigator.clipboard.writeText(url).catch(() => {})
    setToast('Link copiado!')
    setTimeout(() => setToast(null), 2000)
  }

  function handleViewBriefing(c: Contact) {
    setBriefingContact(c)
  }

  if (!hydrated) return null

  const filteredContacts = applyFilters(contacts, filters)

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
          <Link href="/admin/contratos">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs"
              style={{ color: '#a8adb8' }}
            >
              <FileText size={13} />
              Contratos
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setImportOpen(true)}
            className="gap-1.5 text-xs"
            style={{ color: '#a8adb8' }}
          >
            <FileUp size={13} />
            Importar
          </Button>
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

      {/* Filter bar */}
      <FilterBar
        contacts={contacts}
        totalCount={contacts.length}
        filteredCount={filteredContacts.length}
        value={filters}
        onChange={setFilters}
      />

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            className="flex gap-3 p-4 h-full"
            style={{ width: 'max-content', minHeight: 'calc(100vh - 49px)' }}
          >
            {COLUMNS.map(col => {
              const sort = colSorts[col.id] ?? 'temperatura'
              const colContacts = filteredContacts.filter(c => c.status === col.id)
              const sorted = sort === 'agenda'
                ? sortByAgenda(colContacts, activityDates)
                : sortByTemp(colContacts)
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  contacts={sorted}
                  sort={sort}
                  onSortChange={s => handleSortChange(col.id, s)}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  briefingStatus={briefingStatus}
                  onViewBriefing={handleViewBriefing}
                  onCopyBriefingLink={handleCopyBriefingLink}
                  activitySummary={activityDates}
                />
              )
            })}
          </div>
        </DragDropContext>
      </div>

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        existingContacts={contacts}
        onImport={handleImport}
      />

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

      <BriefingModal
        open={!!briefingContact}
        contactId={briefingContact?.id ?? ''}
        contactName={briefingContact?.name ?? ''}
        onClose={() => setBriefingContact(null)}
      />

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg pointer-events-none"
          style={{ backgroundColor: '#22c55e', color: '#fff' }}
        >
          {toast}
        </div>
      )}
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
