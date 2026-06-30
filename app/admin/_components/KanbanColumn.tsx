'use client'

import { useState, useEffect } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Popover } from '@base-ui/react/popover'
import { Info, Thermometer, CalendarClock } from 'lucide-react'
import type { Column } from '../_data'
import type { Contact } from '../_types'
import { ContactCard } from './ContactCard'

type ActivitySummary = { scheduledFor: string; overdue: boolean }
type ColSort = 'temperatura' | 'agenda'

type Props = {
  column: Column
  contacts: Contact[]
  sort: ColSort
  onSortChange: (sort: ColSort) => void
  onEdit: (c: Contact) => void
  onDelete: (id: string) => void
  briefingStatus?: Record<string, boolean>
  onViewBriefing?: (c: Contact) => void
  onCopyBriefingLink?: (c: Contact) => void
  activitySummary?: Record<string, ActivitySummary | null>
}

export function KanbanColumn({
  column, contacts, sort, onSortChange,
  onEdit, onDelete, briefingStatus, onViewBriefing, onCopyBriefingLink,
  activitySummary,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(3)

  // Reset when the set of contacts in this column changes (add/remove/filter)
  // Using sorted ids so reordering alone doesn't trigger a reset
  const contactKey = contacts.map(c => c.id).sort().join(',')
  useEffect(() => {
    setVisibleCount(3)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactKey])

  const visibleContacts = contacts.slice(0, visibleCount)
  const hiddenCount = contacts.length - visibleCount

  return (
    <div
      className="flex flex-col shrink-0 rounded-xl overflow-hidden"
      style={{ width: '260px', backgroundColor: '#1a1d24' }}
    >
      {/* Column header */}
      <div
        className="flex items-center gap-1.5 px-3 py-2.5"
        style={{
          backgroundColor: column.color + '28',
          borderBottom: `2px solid ${column.color}`,
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wider flex-1 truncate"
          style={{ color: '#F2F0EB' }}
        >
          {column.label}
        </span>

        <span
          className="text-xs font-mono px-1.5 py-0.5 rounded shrink-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: '#a8adb8' }}
        >
          {contacts.length}
        </span>

        {/* Sort toggle */}
        <div
          className="flex items-center shrink-0 rounded"
          style={{
            backgroundColor: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(242,240,235,0.08)',
            padding: '1px',
          }}
        >
          {([
            { id: 'temperatura' as ColSort, Icon: Thermometer, title: 'Ordenar por temperatura' },
            { id: 'agenda'      as ColSort, Icon: CalendarClock, title: 'Ordenar por próxima atividade' },
          ]).map(({ id, Icon, title }) => (
            <button
              key={id}
              title={title}
              onClick={() => onSortChange(id)}
              className="p-1 rounded transition-colors"
              style={{
                backgroundColor: sort === id ? 'rgba(242,240,235,0.15)' : 'transparent',
                color: sort === id ? '#FF6B35' : '#6b7280',
              }}
            >
              <Icon size={10} />
            </button>
          ))}
        </div>

        <Popover.Root>
          <Popover.Trigger
            className="shrink-0 p-0.5 rounded transition-colors hover:bg-white/10"
            aria-label={`Dica sobre ${column.label}`}
          >
            <Info size={13} style={{ color: '#a8adb8' }} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner side="bottom" align="end" sideOffset={6}>
              <Popover.Popup
                className="z-30 rounded-lg border p-3 text-xs leading-relaxed shadow-xl"
                style={{
                  maxWidth: '280px',
                  backgroundColor: '#0f1117',
                  borderColor: 'rgba(242,240,235,0.12)',
                  color: '#c8d0dc',
                }}
              >
                {column.note}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-2 space-y-2 transition-colors"
            style={{
              minHeight: '200px',
              backgroundColor: snapshot.isDraggingOver
                ? column.color + '18'
                : 'transparent',
            }}
          >
            {visibleContacts.map((c, index) => (
              <Draggable key={c.id} draggableId={c.id} index={index}>
                {(drag, dragSnap) => (
                  <div
                    ref={drag.innerRef}
                    {...drag.draggableProps}
                    {...drag.dragHandleProps}
                    style={{
                      ...drag.draggableProps.style,
                      opacity: dragSnap.isDragging ? 0.88 : 1,
                    }}
                  >
                    <ContactCard
                      contact={c}
                      onEdit={() => onEdit(c)}
                      onDelete={() => onDelete(c.id)}
                      briefingPreenchido={briefingStatus?.[c.id]}
                      onViewBriefing={onViewBriefing ? () => onViewBriefing(c) : undefined}
                      onCopyBriefingLink={onCopyBriefingLink ? () => onCopyBriefingLink(c) : undefined}
                      nextActivity={activitySummary?.[c.id] ?? undefined}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Ver mais */}
      {hiddenCount > 0 && (
        <div className="px-2 pb-2">
          <button
            onClick={() => setVisibleCount(v => v + 3)}
            className="w-full py-1.5 rounded-lg text-xs font-medium transition-colors bg-transparent hover:bg-[#3D5A80]/20"
            style={{
              border: '1px solid rgba(61,90,128,0.4)',
              color: '#F2F0EB',
            }}
          >
            Ver mais ({hiddenCount})
          </button>
        </div>
      )}
    </div>
  )
}
