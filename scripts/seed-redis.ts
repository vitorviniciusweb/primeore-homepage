import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { getRedis } from '../lib/redis'

const contacts = [
  {
    id: '1',
    name: 'Rafael Florêncio',
    company: 'Personal Trainer / Treinador de Líderes',
    service: 'Site institucional',
    channel: 'Vizinho/pessoal',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Prospecto',
    temperature: 'quente',
    createdAt: '2026-06-23',
  },
  {
    id: '2',
    name: 'Renata Baldo',
    company: 'Fotografia',
    service: 'Site institucional',
    channel: 'Editora HNG',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '3',
    name: 'Bruna Marques',
    company: 'Advogada Tributária',
    service: 'Site institucional',
    channel: 'Prospecção Ativa',
    lastContact: '2026-06-22',
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    createdAt: '2026-06-22',
  },
  {
    id: '4',
    name: 'Odilinha',
    company: 'Buffet (odilinha.com.br fora do ar)',
    service: 'Site institucional',
    channel: 'Indicação familiar',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '5',
    name: 'Samuel',
    company: 'Distribuidora de bebidas para eventos',
    service: 'Site institucional',
    channel: 'Colega',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Prospecto',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '6',
    name: 'Patrick',
    company: 'Câmera de Monitoramento',
    service: 'Site institucional',
    channel: 'Amigos',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Contato Feito',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '7',
    name: 'Evandro',
    company: '2T Engenharia',
    service: 'Site institucional',
    channel: 'Contato profissional',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Contato Feito',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '8',
    name: 'Soniedes Fonseca',
    company: 'Barbearia Ponta da Praia',
    service: 'Site institucional',
    channel: 'Família',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Contato Feito',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '9',
    name: 'Júlio César',
    company: 'Editora HNG',
    service: 'Site institucional',
    channel: 'Indicação',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Fechado',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
  {
    id: '10',
    name: 'Silvia Simone',
    company: 'Bastidores do Sucesso',
    service: 'Site institucional',
    channel: 'Família',
    lastContact: '2026-06-23',
    notes: '',
    status: 'Fechado',
    temperature: 'morno',
    createdAt: '2026-06-23',
  },
]

async function seed() {
  const redis = getRedis()
  await redis.set('primeore_contacts', contacts)
  console.log(`✅ Redis populado com ${contacts.length} contatos`)
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Erro ao popular Redis:', err)
  process.exit(1)
})
