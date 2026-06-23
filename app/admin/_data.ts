import type { Contact } from './_types'

export type Column = {
  id: string
  label: string
  color: string
  note: string
}

export const COLUMNS: Column[] = [
  {
    id: 'Prospecto',
    label: 'Prospecto',
    color: '#3D5A80',
    note: 'Antes de abordar, pesquise o negócio dele: tem site? Como está a presença digital? Qual a dor mais provável? Chegue no primeiro contato com uma observação específica — isso te diferencia de abordagem genérica e aumenta muito a taxa de resposta.',
  },
  {
    id: 'Contato Feito',
    label: 'Contato Feito',
    color: '#3D5A80',
    note: 'Seu objetivo aqui não é vender — é abrir conversa. Use uma observação específica sobre o negócio dele ou entregue valor imediato. Não mande áudio longo no primeiro contato. Sem resposta em 3 dias: faça um follow-up curto e diferente do anterior.',
  },
  {
    id: 'Qualificado',
    label: 'Qualificado',
    color: '#FF6B35',
    note: 'Qualificado não é "respondeu animado" — é quem passou pelo diagnóstico consultivo. Pergunte sobre o estado atual e o estado desejado. Deixe ele descobrir a dor. Só avance para proposta quando souber: ele decide sozinho? Tem urgência? Tem orçamento?',
  },
  {
    id: 'Proposta Enviada',
    label: 'Proposta Enviada',
    color: '#FF6B35',
    note: 'Nunca envie proposta e suma. Combine na reunião uma data de retorno. Se passar 5 dias sem resposta, faça follow-up agregando valor — não "chegou a ver?", mas um dado ou case relevante para o negócio dele.',
  },
  {
    id: 'Fechado',
    label: 'Fechado',
    color: '#1a4a2e',
    note: 'Registre o que funcionou: qual gatilho fez ele fechar? Qual objeção você quebrou? No onboarding, já peça indicação — quem acabou de comprar está no pico da confiança em você.',
  },
  {
    id: 'Perdido',
    label: 'Perdido',
    color: '#4a1a1a',
    note: 'Registre o motivo com precisão: "achou caro" ≠ "não viu valor" ≠ "fechou com concorrente". Acumulado, isso revela onde seu processo falha. Coloque lembrete de 90 dias — situações mudam.',
  },
]

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const now = new Date().toISOString()

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: uid(),
    name: 'Evandro',
    company: '2T Engenharia',
    service: 'Site institucional',
    channel: 'Contato profissional',
    lastContact: now,
    notes: '',
    status: 'Contato Feito',
    temperature: 'morno',
    createdAt: now,
  },
  {
    id: uid(),
    name: 'Tio',
    company: 'Barbearia Ponta da Praia',
    service: 'Site institucional',
    channel: 'Família',
    lastContact: now,
    notes: '',
    status: 'Contato Feito',
    temperature: 'morno',
    createdAt: now,
  },
  {
    id: uid(),
    name: 'Rafael Florêncio',
    company: 'Personal Trainer / Treinador de Líderes',
    service: 'Site institucional',
    channel: 'Vizinho/pessoal',
    lastContact: now,
    notes: '',
    status: 'Qualificado',
    temperature: 'morno',
    createdAt: now,
  },
  {
    id: uid(),
    name: 'Samuel',
    company: 'Distribuidora de bebidas para eventos',
    service: 'Site institucional',
    channel: 'Colega',
    lastContact: now,
    notes: '',
    status: 'Qualificado',
    temperature: 'morno',
    createdAt: now,
  },
  {
    id: uid(),
    name: 'Odilinha',
    company: 'Buffet (odilinha.com.br fora do ar)',
    service: 'Site institucional',
    channel: 'Indicação familiar',
    lastContact: now,
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    createdAt: now,
  },
]
