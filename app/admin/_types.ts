export type Temperature = 'quente' | 'morno' | 'frio'

export type Collaborator = {
  id: string
  name: string
  role: string
  phone?: string
  email?: string
}

export type SocialMedia = {
  platform: string
  url: string
}

export type Contact = {
  id: string
  name: string
  company: string
  services: string[]
  channel: string
  lastContact: string
  notes: string
  status: string
  temperature: Temperature
  phone?: string
  email?: string
  collaborators?: Collaborator[]
  lostReason?: string
  createdAt: string
  briefingPreenchido?: boolean
  socialMedia?: SocialMedia[]
}

export type Briefing = {
  contactId: string
  respostas: {
    nomeEmpresa: string
    segmento: string
    tempoMercado?: string
    servicosProdutos: string
    diferencial: string
    cidadeBairro?: string
    clienteIdeal?: string
    problemaResolvido?: string
    objetivoPrincipal: string
    referenciasVisuais?: string
    preferenciaCores?: string
    whatsappNegocio: string
    emailContato?: string
    enderecoFisico?: string
    redesSociais?: string
    temLogo: 'Sim' | 'Não'
    temFotos: 'Sim' | 'Não' | 'Estou providenciando'
  }
  preenchidoEm: string
}
