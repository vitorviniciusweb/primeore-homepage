import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRedis } from '@/lib/redis'
import type { Contrato, ClienteParte, Secao } from '@/app/admin/contratos/_types'
import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'

export const runtime = 'nodejs'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 60,
    paddingLeft: 60,
    paddingRight: 60,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FF6B35',
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 9,
    lineHeight: 1.7,
    marginBottom: 3,
    color: '#1a1a1a',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  indented: {
    marginLeft: 12,
    fontSize: 9,
    lineHeight: 1.7,
    marginBottom: 2,
    color: '#1a1a1a',
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signatureCol: {
    width: '44%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    width: '100%',
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  signatureRole: {
    fontSize: 8,
    color: '#555555',
    textAlign: 'center',
    marginTop: 1,
  },
  location: {
    fontSize: 9,
    marginTop: 24,
    color: '#1a1a1a',
  },
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function clienteNomes(clientes: ClienteParte[]): string {
  return clientes.map(c => c.nome).join(' / ')
}

function ContratoPDF({ contrato }: { contrato: Contrato }) {
  return (
    <Document
      title={`Contrato Primeore — ${clienteNomes(contrato.clientes)}`}
      author="Primeore"
    >
      <Page size="A4" style={styles.page}>
        {/* Título */}
        <Text style={styles.headerTitle}>
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS
        </Text>
        <Text style={{ fontSize: 9, color: '#666666', textAlign: 'center', marginBottom: 4 }}>
          Criação de Site Institucional
        </Text>
        <View style={styles.divider} />

        {/* 1. PARTES */}
        <Text style={styles.sectionTitle}>1. Partes</Text>

        <Text style={styles.text}>
          <Text style={styles.bold}>PRESTADOR:</Text>
          {' '}Vitor Vinícius Fonseca Pires, CPF 436.764.328-00, e-mail vitorviniciusweb@gmail.com,
          WhatsApp (13) 97810-9003, atuando sob a marca Primeore.
        </Text>

        {contrato.clientes.map((cliente: ClienteParte) => (
          <Text key={cliente.id} style={styles.text}>
            <Text style={styles.bold}>CLIENTE:</Text>
            {' '}{cliente.nome} — {cliente.tipo} {cliente.documento} — {cliente.email} — WhatsApp {cliente.whatsapp}
          </Text>
        ))}

        <View style={styles.divider} />

        {/* 2. OBJETO */}
        <Text style={styles.sectionTitle}>2. Objeto do Contrato</Text>

        <Text style={styles.text}>
          <Text style={styles.bold}>Tipo de projeto:</Text> {contrato.tipoProjeto}
        </Text>

        <Text style={[styles.text, { marginTop: 4 }]}>
          <Text style={styles.bold}>Seções incluídas:</Text>
        </Text>
        {contrato.secoes.map((s: Secao) => (
          <Text key={s.id} style={styles.indented}>
            • {s.nome}{s.descricao ? ` — ${s.descricao}` : ''}
          </Text>
        ))}

        <Text style={[styles.text, { marginTop: 6 }]}>
          Identidade visual exclusiva, copy otimizada para SEO, integração com WhatsApp, Google
          Analytics e Meta Pixel. Site responsivo para desktop e dispositivos móveis.
        </Text>

        <Text style={[styles.text, { marginTop: 4 }]}>
          <Text style={styles.bold}>Valor total:</Text> {formatCurrency(contrato.valorTotal)}
        </Text>

        <Text style={styles.text}>
          Alterações após entrega não estão incluídas e serão formalizadas por adendo.
        </Text>

        <View style={styles.divider} />

        {/* 3. PRAZO */}
        <Text style={styles.sectionTitle}>3. Prazo de Entrega</Text>
        <Text style={styles.text}>
          O prazo será definido após briefing e recebimento da entrada. Condições para início:
          pagamento da entrada (50%) e briefing completo. Atraso de materiais pelo cliente suspende
          o prazo automaticamente.
        </Text>

        <View style={styles.divider} />

        {/* 4. PAGAMENTO */}
        <Text style={styles.sectionTitle}>4. Pagamento</Text>
        <Text style={styles.indented}>
          • 50% na assinatura: {formatCurrency(contrato.valorEntrada)} — condição para início.
        </Text>
        <Text style={styles.indented}>
          • 50% na entrega: {formatCurrency(contrato.valorEntrega)} — condição para publicação.
        </Text>
        <Text style={[styles.text, { marginTop: 4 }]}>
          O site somente será publicado após quitação integral.
        </Text>

        <View style={styles.divider} />

        {/* 5. REVISÕES */}
        <Text style={styles.sectionTitle}>5. Revisões</Text>
        <Text style={styles.text}>
          2 rodadas de revisão incluídas. Cliente tem 5 dias úteis para retorno após cada
          apresentação. Prazo sem retorno = etapa aprovada. 10 dias sem resposta = projeto suspenso.
        </Text>

        <View style={styles.divider} />

        {/* 6. PROPRIEDADE */}
        <Text style={styles.sectionTitle}>6. Propriedade Intelectual</Text>
        <Text style={styles.text}>
          Após a quitação integral do contrato, todos os arquivos e o código-fonte do site pertencem
          exclusivamente ao CLIENTE, que poderá solicitar os arquivos mediante aviso prévio de 5
          (cinco) dias úteis. O PRESTADOR reserva-se o direito de incluir o projeto em seu portfólio,
          salvo solicitação expressa em contrário pelo CLIENTE.
        </Text>

        <View style={styles.divider} />

        {/* 7. CANCELAMENTO */}
        <Text style={styles.sectionTitle}>7. Cancelamento</Text>
        <Text style={styles.indented}>
          • Antes do início: entrada retida como taxa administrativa.
        </Text>
        <Text style={styles.indented}>
          • Após início: todos os valores pagos retidos. Sem obrigação de entregar arquivos parciais.
        </Text>

        <View style={styles.divider} />

        {/* 8. SIGILO */}
        <Text style={styles.sectionTitle}>8. Sigilo</Text>
        <Text style={styles.text}>
          Informações confidenciais do cliente não serão divulgadas a terceiros.
        </Text>

        <View style={styles.divider} />

        {/* 9. FORO */}
        <Text style={styles.sectionTitle}>9. Foro</Text>
        <Text style={styles.text}>Comarca de Santos/SP.</Text>

        <View style={styles.divider} />

        {/* Assinatura */}
        <Text style={styles.location}>
          Santos/SP, {formatDate(contrato.dataAssinatura)}
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Vitor Vinícius Fonseca Pires</Text>
            <Text style={styles.signatureRole}>Primeore — Prestador de Serviços</Text>
          </View>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{clienteNomes(contrato.clientes)}</Text>
            <Text style={styles.signatureRole}>Cliente</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const store = await cookies()
  if (store.get('primeore_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const contracts = await getRedis().get<Contrato[]>('primeore_contracts')
    const contrato = (contracts ?? []).find(c => c.id === id)

    if (!contrato) {
      return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 })
    }

    const buffer = await renderToBuffer(<ContratoPDF contrato={contrato} />)

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrato-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[PDF Error]', error)
    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
