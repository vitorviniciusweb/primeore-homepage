export type ClienteParte = {
  id: string
  tipo: 'CPF' | 'CNPJ'
  nome: string
  documento: string
  email: string
  whatsapp: string
}

export type Secao = {
  id: string
  nome: string
  descricao: string
}

export type Contrato = {
  id: string
  clientes: ClienteParte[]
  tipoProjeto: 'Presença Profissional' | 'Projeto Sob Medida'
  secoes: Secao[]
  valorTotal: number
  valorEntrada: number
  valorEntrega: number
  dataAssinatura: string
  status: 'Rascunho' | 'Aguardando Assinatura' | 'Assinado' | 'Cancelado'
  linkClickSign?: string
  linkAsaas?: string
  statusPagamento?: 'Pendente' | 'Entrada Paga' | 'Quitado'
  createdAt: string
}
