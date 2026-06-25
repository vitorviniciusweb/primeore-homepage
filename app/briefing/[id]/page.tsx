'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Briefing } from '@/app/admin/_types'

// ── Types ──────────────────────────────────────────────────────────────────────

type FormState = {
  nomeEmpresa: string
  segmento: string
  tempoMercado: string
  servicosProdutos: string
  diferencial: string
  cidadeBairro: string
  clienteIdeal: string
  problemaResolvido: string
  objetivoPrincipal: string
  objetivoOutro: string
  referenciasVisuais: string
  preferenciaCores: string
  whatsappNegocio: string
  emailContato: string
  enderecoFisico: string
  redesSociais: string
  temLogo: 'Sim' | 'Não' | ''
  temFotos: 'Sim' | 'Não' | 'Estou providenciando' | ''
}

type FormErrors = Partial<Record<keyof FormState, string>>

// ── Helpers ────────────────────────────────────────────────────────────────────

function initialForm(): FormState {
  return {
    nomeEmpresa: '',
    segmento: '',
    tempoMercado: '',
    servicosProdutos: '',
    diferencial: '',
    cidadeBairro: '',
    clienteIdeal: '',
    problemaResolvido: '',
    objetivoPrincipal: '',
    objetivoOutro: '',
    referenciasVisuais: '',
    preferenciaCores: '',
    whatsappNegocio: '',
    emailContato: '',
    enderecoFisico: '',
    redesSociais: '',
    temLogo: '',
    temFotos: '',
  }
}

function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const OBJETIVO_OPTIONS = [
  'Gerar contato via WhatsApp',
  'Transmitir credibilidade',
  'Vender produtos/serviços',
  'Outro (descrever abaixo)',
]

function validate(form: FormState): FormErrors {
  const e: FormErrors = {}
  if (!form.nomeEmpresa.trim()) e.nomeEmpresa = 'Campo obrigatório'
  if (!form.segmento.trim()) e.segmento = 'Campo obrigatório'
  if (!form.servicosProdutos.trim()) e.servicosProdutos = 'Campo obrigatório'
  if (!form.diferencial.trim()) e.diferencial = 'Campo obrigatório'
  if (!form.objetivoPrincipal) e.objetivoPrincipal = 'Selecione uma opção'
  if (!form.whatsappNegocio.replace(/\D/g, '') || form.whatsappNegocio.replace(/\D/g, '').length < 10)
    e.whatsappNegocio = 'WhatsApp inválido'
  if (!form.temLogo) e.temLogo = 'Campo obrigatório'
  if (!form.temFotos) e.temFotos = 'Campo obrigatório'
  return e
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2
        className="text-sm font-semibold uppercase tracking-widest mb-2"
        style={{ color: '#FF6B35', fontFamily: 'var(--font-display, serif)' }}
      >
        {title}
      </h2>
      <div style={{ height: 1, backgroundColor: 'rgba(255,107,53,0.25)' }} />
    </div>
  )
}

function FieldWrapper({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: '#c8d0dc' }}>
        {label}
        {required && <span style={{ color: '#FF6B35' }}> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg px-4 py-3 text-sm"
      style={{
        backgroundColor: 'rgba(255,107,53,0.08)',
        border: '1px solid rgba(255,107,53,0.2)',
        color: '#F2F0EB',
      }}
    >
      {children}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BriefingPage() {
  const params = useParams()
  const id = params.id as string

  const [pageState, setPageState] = useState<'loading' | 'filled' | 'form' | 'success'>('loading')
  const [filledBy, setFilledBy] = useState('')
  const [form, setForm] = useState<FormState>(initialForm())
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetch(`/api/briefing/${id}`)
      .then(r => r.json())
      .then((data: Briefing | null) => {
        if (data) {
          setFilledBy(data.respostas.nomeEmpresa || '')
          setPageState('filled')
        } else {
          setPageState('form')
        }
      })
      .catch(() => setPageState('form'))
  }, [id])

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) {
      setErrors(e => {
        const n = { ...e }
        delete n[field]
        return n
      })
    }
  }

  async function handleSubmit() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setSubmitError('')

    const objetivo =
      form.objetivoPrincipal === 'Outro (descrever abaixo)'
        ? form.objetivoOutro.trim() || 'Outro'
        : form.objetivoPrincipal

    const briefing: Briefing = {
      contactId: id,
      preenchidoEm: new Date().toISOString(),
      respostas: {
        nomeEmpresa: form.nomeEmpresa.trim(),
        segmento: form.segmento.trim(),
        tempoMercado: form.tempoMercado.trim() || undefined,
        servicosProdutos: form.servicosProdutos.trim(),
        diferencial: form.diferencial.trim(),
        cidadeBairro: form.cidadeBairro.trim() || undefined,
        clienteIdeal: form.clienteIdeal.trim() || undefined,
        problemaResolvido: form.problemaResolvido.trim() || undefined,
        objetivoPrincipal: objetivo,
        referenciasVisuais: form.referenciasVisuais.trim() || undefined,
        preferenciaCores: form.preferenciaCores.trim() || undefined,
        whatsappNegocio: form.whatsappNegocio.trim(),
        emailContato: form.emailContato.trim() || undefined,
        enderecoFisico: form.enderecoFisico.trim() || undefined,
        redesSociais: form.redesSociais.trim() || undefined,
        temLogo: form.temLogo as 'Sim' | 'Não',
        temFotos: form.temFotos as 'Sim' | 'Não' | 'Estou providenciando',
      },
    }

    try {
      const res = await fetch(`/api/briefing/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefing),
      })
      if (!res.ok) throw new Error('Erro no servidor')
      setPageState('success')
    } catch {
      setSubmitError('Ocorreu um erro ao enviar. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── CSS for inputs ────────────────────────────────────────────────────────────
  const cssReset = `
    .bf-input {
      background: #1e2229;
      border: 1px solid #3D5A80;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      color: #F2F0EB;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      font-family: inherit;
      width: 100%;
    }
    .bf-input::placeholder { color: #4b5563; }
    .bf-input:focus {
      border-color: #FF6B35;
      box-shadow: 0 0 0 2px rgba(255,107,53,0.15);
    }
    .bf-input.error {
      border-color: #ef4444;
    }
    .bf-input.error:focus {
      box-shadow: 0 0 0 2px rgba(239,68,68,0.15);
    }
    select.bf-input option { background: #1e2229; }
  `

  // ── Render states ─────────────────────────────────────────────────────────────

  if (pageState === 'loading') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#16191F' }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#FF6B35', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (pageState === 'filled') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: '#16191F' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <p className="text-4xl mb-6">✅</p>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: '#FF6B35', fontFamily: 'var(--font-display, serif)' }}
          >
            Primeore
          </h1>
          <p className="text-lg font-medium mb-2" style={{ color: '#F2F0EB' }}>
            Pré-briefing já enviado!
          </p>
          <p className="text-sm" style={{ color: '#a8adb8' }}>
            Obrigado{filledBy ? `, ${filledBy}` : ''}. Entraremos em contato em breve.
          </p>
        </motion.div>
      </div>
    )
  }

  if (pageState === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: '#16191F' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <p className="text-4xl mb-6">🎉</p>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: '#FF6B35', fontFamily: 'var(--font-display, serif)' }}
          >
            Pré-briefing enviado!
          </h1>
          <p className="text-base mb-4" style={{ color: '#F2F0EB' }}>
            Obrigado, <strong>{form.nomeEmpresa}</strong>!<br />
            Recebemos todas as informações e entraremos em contato em breve para dar início ao seu projeto.
          </p>
          <p className="text-sm" style={{ color: '#6b7280' }}>
            — Equipe Primeore
          </p>
        </motion.div>
      </div>
    )
  }

  // ── Main form ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{cssReset}</style>

      <div className="min-h-screen" style={{ backgroundColor: '#16191F' }}>
        {/* Header */}
        <header
          className="py-8 px-4 text-center"
          style={{ borderBottom: '1px solid rgba(242,240,235,0.06)' }}
        >
          <h1
            className="text-3xl font-bold"
            style={{ color: '#FF6B35', fontFamily: 'var(--font-display, serif)' }}
          >
            Primeore
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#a8adb8' }}>
            Vamos construir seu site juntos
          </p>
        </header>

        {/* Form container */}
        <div className="max-w-[600px] mx-auto px-4 py-10 pb-20">
          <div className="mb-8">
            <h2
              className="text-xl font-semibold mb-1"
              style={{ color: '#F2F0EB', fontFamily: 'var(--font-display, serif)' }}
            >
              Pré-briefing do site
            </h2>
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Preencha com calma — essas informações são a base do seu projeto.
              Campos com <span style={{ color: '#FF6B35' }}>*</span> são obrigatórios.
            </p>
          </div>

          <div className="space-y-10">

            {/* ── Seção 1: Sobre o Negócio ────────────────────────────────────── */}
            <section>
              <SectionHeader title="Sobre o Negócio" />
              <div className="space-y-5">

                <div id="field-nomeEmpresa">
                  <FieldWrapper label="Qual o nome da empresa ou do profissional?" required error={errors.nomeEmpresa}>
                    <input
                      className={`bf-input${errors.nomeEmpresa ? ' error' : ''}`}
                      value={form.nomeEmpresa}
                      onChange={e => set('nomeEmpresa', e.target.value)}
                      placeholder="Ex: Studio Aline Estética, Dr. João Silva"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-segmento">
                  <FieldWrapper
                    label="Qual o segmento de atuação?"
                    required
                    error={errors.segmento}
                    hint="Ex: advocacia, consultoria, estética"
                  >
                    <input
                      className={`bf-input${errors.segmento ? ' error' : ''}`}
                      value={form.segmento}
                      onChange={e => set('segmento', e.target.value)}
                      placeholder="Ex: Clínica de estética"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-tempoMercado">
                  <FieldWrapper label="Há quanto tempo está no mercado?">
                    <input
                      className="bf-input"
                      value={form.tempoMercado}
                      onChange={e => set('tempoMercado', e.target.value)}
                      placeholder="Ex: 3 anos"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-servicosProdutos">
                  <FieldWrapper label="Quais são os serviços ou produtos oferecidos?" required error={errors.servicosProdutos}>
                    <textarea
                      className={`bf-input${errors.servicosProdutos ? ' error' : ''}`}
                      rows={3}
                      value={form.servicosProdutos}
                      onChange={e => set('servicosProdutos', e.target.value)}
                      placeholder="Liste os principais serviços ou produtos..."
                    />
                  </FieldWrapper>
                </div>

                <div id="field-diferencial">
                  <FieldWrapper label="Qual é o principal diferencial do seu negócio?" required error={errors.diferencial}>
                    <textarea
                      className={`bf-input${errors.diferencial ? ' error' : ''}`}
                      rows={3}
                      value={form.diferencial}
                      onChange={e => set('diferencial', e.target.value)}
                      placeholder="O que te diferencia dos concorrentes?"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-cidadeBairro">
                  <FieldWrapper label="Qual cidade e bairro de atuação?">
                    <input
                      className="bf-input"
                      value={form.cidadeBairro}
                      onChange={e => set('cidadeBairro', e.target.value)}
                      placeholder="Ex: Santos, Gonzaga"
                    />
                  </FieldWrapper>
                </div>

              </div>
            </section>

            {/* ── Seção 2: Sobre o Cliente Ideal ──────────────────────────────── */}
            <section>
              <SectionHeader title="Sobre o Cliente Ideal" />
              <div className="space-y-5">

                <div id="field-clienteIdeal">
                  <FieldWrapper label="Quem é o seu cliente ideal?" hint="Idade, perfil, situação">
                    <textarea
                      className="bf-input"
                      rows={3}
                      value={form.clienteIdeal}
                      onChange={e => set('clienteIdeal', e.target.value)}
                      placeholder="Ex: Mulheres entre 30–45 anos que buscam tratamentos estéticos preventivos..."
                    />
                  </FieldWrapper>
                </div>

                <div id="field-problemaResolvido">
                  <FieldWrapper label="Qual o principal problema que seu cliente resolve ao te contratar?">
                    <textarea
                      className="bf-input"
                      rows={3}
                      value={form.problemaResolvido}
                      onChange={e => set('problemaResolvido', e.target.value)}
                      placeholder="Ex: Encontrar um profissional confiável para..."
                    />
                  </FieldWrapper>
                </div>

              </div>
            </section>

            {/* ── Seção 3: Sobre o Site ────────────────────────────────────────── */}
            <section>
              <SectionHeader title="Sobre o Site" />
              <div className="space-y-5">

                <div id="field-objetivoPrincipal">
                  <FieldWrapper label="Qual o objetivo principal do site?" required error={errors.objetivoPrincipal}>
                    <select
                      className={`bf-input${errors.objetivoPrincipal ? ' error' : ''}`}
                      value={form.objetivoPrincipal}
                      onChange={e => set('objetivoPrincipal', e.target.value)}
                    >
                      <option value="">Selecione uma opção...</option>
                      {OBJETIVO_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </FieldWrapper>

                  {form.objetivoPrincipal === 'Outro (descrever abaixo)' && (
                    <div className="mt-3">
                      <input
                        className="bf-input"
                        value={form.objetivoOutro}
                        onChange={e => set('objetivoOutro', e.target.value)}
                        placeholder="Descreva o objetivo do site..."
                      />
                    </div>
                  )}
                </div>

                <div id="field-referenciasVisuais">
                  <FieldWrapper label="Tem algum site ou referência visual que admira?">
                    <input
                      className="bf-input"
                      value={form.referenciasVisuais}
                      onChange={e => set('referenciasVisuais', e.target.value)}
                      placeholder="Cole um link ou descreva o estilo..."
                    />
                  </FieldWrapper>
                </div>

                <div id="field-preferenciaCores">
                  <FieldWrapper label="Tem preferência de cores ou alguma cor que representa seu negócio?">
                    <input
                      className="bf-input"
                      value={form.preferenciaCores}
                      onChange={e => set('preferenciaCores', e.target.value)}
                      placeholder="Ex: azul marinho e dourado, tons terrosos..."
                    />
                  </FieldWrapper>
                </div>

              </div>
            </section>

            {/* ── Seção 4: Contatos e Redes ────────────────────────────────────── */}
            <section>
              <SectionHeader title="Contatos e Redes" />
              <div className="space-y-5">

                <div id="field-whatsappNegocio">
                  <FieldWrapper label="WhatsApp de contato do negócio" required error={errors.whatsappNegocio}>
                    <input
                      className={`bf-input${errors.whatsappNegocio ? ' error' : ''}`}
                      value={form.whatsappNegocio}
                      onChange={e => set('whatsappNegocio', maskPhone(e.target.value))}
                      placeholder="(13) 99999-9999"
                      inputMode="tel"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-emailContato">
                  <FieldWrapper label="E-mail de contato">
                    <input
                      className="bf-input"
                      type="email"
                      value={form.emailContato}
                      onChange={e => set('emailContato', e.target.value)}
                      placeholder="contato@suaempresa.com"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-enderecoFisico">
                  <FieldWrapper label="Endereço físico (se aplicável)">
                    <input
                      className="bf-input"
                      value={form.enderecoFisico}
                      onChange={e => set('enderecoFisico', e.target.value)}
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </FieldWrapper>
                </div>

                <div id="field-redesSociais">
                  <FieldWrapper
                    label="Quais redes sociais possui?"
                    hint="Instagram, LinkedIn, YouTube, outros"
                  >
                    <textarea
                      className="bf-input"
                      rows={2}
                      value={form.redesSociais}
                      onChange={e => set('redesSociais', e.target.value)}
                      placeholder="@suaempresa no Instagram, linkedin.com/in/seu-perfil..."
                    />
                  </FieldWrapper>
                </div>

              </div>
            </section>

            {/* ── Seção 5: Arquivos ────────────────────────────────────────────── */}
            <section>
              <SectionHeader title="Arquivos" />
              <div className="space-y-7">

                <div id="field-temLogo">
                  <FieldWrapper label="Tem logo?" required error={errors.temLogo}>
                    <div className="flex gap-3 mt-1">
                      {(['Sim', 'Não'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => set('temLogo', opt)}
                          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                          style={{
                            border: form.temLogo === opt
                              ? '2px solid #FF6B35'
                              : errors.temLogo
                                ? '1px solid #ef4444'
                                : '1px solid #3D5A80',
                            backgroundColor: form.temLogo === opt
                              ? 'rgba(255,107,53,0.12)'
                              : '#1e2229',
                            color: form.temLogo === opt ? '#FF6B35' : '#a8adb8',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {form.temLogo === 'Sim' && (
                      <div className="mt-3">
                        <InfoBox>
                          Ótimo! O Vitor vai te pedir o arquivo logo após a entrega do briefing.
                        </InfoBox>
                      </div>
                    )}
                  </FieldWrapper>
                </div>

                <div id="field-temFotos">
                  <FieldWrapper label="Tem fotos profissionais do negócio?" required error={errors.temFotos}>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {(['Sim', 'Não', 'Estou providenciando'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => set('temFotos', opt)}
                          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all min-w-[100px]"
                          style={{
                            border: form.temFotos === opt
                              ? '2px solid #FF6B35'
                              : errors.temFotos
                                ? '1px solid #ef4444'
                                : '1px solid #3D5A80',
                            backgroundColor: form.temFotos === opt
                              ? 'rgba(255,107,53,0.12)'
                              : '#1e2229',
                            color: form.temFotos === opt ? '#FF6B35' : '#a8adb8',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {form.temFotos === 'Estou providenciando' && (
                      <div className="mt-3">
                        <InfoBox>
                          Sem problemas! Combinamos os detalhes depois.
                        </InfoBox>
                      </div>
                    )}
                  </FieldWrapper>
                </div>

              </div>
            </section>

            {/* ── Submit ───────────────────────────────────────────────────────── */}
            <div className="pt-2">
              {submitError && (
                <p className="text-sm mb-4 text-center" style={{ color: '#ef4444' }}>
                  {submitError}
                </p>
              )}

              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.01 } : {}}
                whileTap={!submitting ? { scale: 0.99 } : {}}
                className="w-full py-3.5 rounded-xl text-base font-semibold transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#FF6B35', color: '#fff' }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                      style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
                    />
                    Enviando...
                  </span>
                ) : (
                  'Enviar Pré-Briefing'
                )}
              </motion.button>

              <p className="text-xs text-center mt-4" style={{ color: '#4b5563' }}>
                Seus dados são usados apenas para a criação do seu site.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
