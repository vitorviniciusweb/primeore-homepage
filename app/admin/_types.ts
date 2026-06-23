export type Temperature = 'quente' | 'morno' | 'frio'

export type Collaborator = {
  id: string
  name: string
  role: string
  phone?: string
  email?: string
}

export type Contact = {
  id: string
  name: string
  company: string
  service: string
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
}
