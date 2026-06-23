'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import { Popover } from '@base-ui/react/popover'
import { Info } from 'lucide-react'
import type { Column } from '../_data'
import type { Contact } from '../_types'
import { ContactCard } from './ContactCard'

type Props = {
  column: Column
  contacts: Contact[]
  onEdit: (c: Contact) => void
  onDelete: (id: string) => void
}

export function KanbanColumn({ column, contacts, onEdit, onDelete }: Props) {
  return (
    <div
      className="flex flex-col shrink-0 rounded-xl overflow-hidden"
      style={{ width: '260px', backgroundColor: '#1a1d24' }}
    >
      {/* Column header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
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
            {contacts.map((c, index) => (
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
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
