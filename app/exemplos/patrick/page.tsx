import './patrick.css'
import PatrickScripts from './PatrickScripts'

export default function PatrickPage() {
  return (
    <>
      <div className="hazard"></div>
      <header>
        <div className="wrap">
          <a href="#" className="logo-word" aria-label="Patrick Serviços Gerais">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 230 60"
              aria-labelledby="logoTitle"
              role="img"
              style={{ height: '40px', width: 'auto', display: 'block' }}
            >
              <title id="logoTitle">Patrick Serviços Gerais</title>
              <g>
                <path
                  d="M6,42 L30,15 L54,42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  fillRule="evenodd"
                  fill="#D9720A"
                  d="M30,37 L36.5,40.5 L36.5,47.5 L30,51 L23.5,47.5 L23.5,40.5 Z
               M32.7,44 A2.7,2.7 0 1 1 27.3,44 A2.7,2.7 0 1 1 32.7,44 Z"
                />
              </g>
              <g transform="translate(70,0)">
                <text
                  x="0"
                  y="28"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="26"
                  fontWeight="700"
                  fill="currentColor"
                  transform="scale(0.92,1)"
                >
                  Patrick
                </text>
                <text
                  x="0"
                  y="46"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="2.5"
                  fill="#D9720A"
                >
                  SERVIÇOS GERAIS
                </text>
              </g>
            </svg>
          </a>
          <nav>
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="#faq">FAQ</a>
            <a href="#contato">Contato</a>
          </nav>
          {/* Confirmar formato do número antes de publicar — 8 dígitos após o DDD, celular brasileiro costuma ter 9 */}
          <a
            href="https://wa.me/554891158924?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais."
            className="btn btn-whats"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow">Manutenção residencial · Florianópolis/SC</span>
            <h1>Sua casa em ordem, sem complicação</h1>
            <p className="lead">
              Pintura, instalação de câmeras, wi-fi, montagem de móveis e mais. Peça um orçamento com fotos e
              receba uma resposta rápida.
            </p>
            <div className="hero-ctas">
              <a href="#orcamento" className="btn btn-primary btn-lg">Pedir orçamento</a>
              <a href="#servicos" className="btn btn-ghost btn-lg">Ver serviços</a>
            </div>
          </div>
          <div className="hero-art">
            <img
              src="/exemplos/patrick/patrick-hero-foto-v2-recorte.png"
              alt="Profissional de manutenção residencial com ferramentas"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Como funciona</span>
            <h2>Do pedido ao serviço pronto</h2>
            <p>Um processo simples pra você não perder tempo esperando visita antes de saber se vale a pena.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Envie seu pedido</h3>
              <p>Preencha o formulário com uma descrição e fotos do que precisa.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Receba uma resposta rápida</h3>
              <p>Análise do pedido com retorno sobre valor estimado e prazo.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Agende a visita, se precisar</h3>
              <p>Serviços mais simples podem ser resolvidos sem visita prévia.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="servicos">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">O que fazemos</span>
            <h2>Serviços</h2>
          </div>
          <div className="serv-grid">
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="14" height="5" rx="1" />
                  <path d="M6 9v11h4V9" />
                </svg>
              </div>
              <h4>Pintura e restauração</h4>
              <p>Paredes, móveis e reparos de acabamento.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20pintura%20e%20restaura%C3%A7%C3%A3o.">
                Pedir orçamento
              </a>
            </div>
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="15" height="11" rx="2" />
                  <path d="M17 10l5-3v11l-5-3" />
                </svg>
              </div>
              <h4>Câmeras e monitoramento</h4>
              <p>Instalação residencial, equipamento incluso.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20instala%C3%A7%C3%A3o%20de%20c%C3%A2meras.">
                Pedir orçamento
              </a>
            </div>
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M2 8.5a15 15 0 0 1 20 0" />
                  <path d="M5.5 12a10 10 0 0 1 13 0" />
                  <path d="M9 15.5a5 5 0 0 1 6 0" />
                </svg>
              </div>
              <h4>Wi-Fi e rede</h4>
              <p>Expansão de sinal para a casa toda.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20instala%C3%A7%C3%A3o%20de%20wi-fi.">
                Pedir orçamento
              </a>
            </div>
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              </div>
              <h4>Montagem de móveis</h4>
              <p>Móveis planejados e itens comprados online.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20montagem%20de%20m%C3%B3veis.">
                Pedir orçamento
              </a>
            </div>
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="13" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h4>TV a cabo</h4>
              <p>Instalação e configuração de ponto de TV.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20instala%C3%A7%C3%A3o%20de%20TV%20a%20cabo.">
                Pedir orçamento
              </a>
            </div>
            <div className="serv-card">
              <div className="serv-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 10v4h3l5 4V6l-5 4H4z" />
                  <path d="M17 9a5 5 0 0 1 0 6" />
                </svg>
              </div>
              <h4>Som ambiente</h4>
              <p>Caixas de som instaladas e integradas ao ambiente.</p>
              <a href="https://wa.me/554891158924?text=Ol%C3%A1!%20Tenho%20interesse%20em%20som%20ambiente.">
                Pedir orçamento
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="sobre">
        <div className="wrap">
          <div>
            <span className="eyebrow">Quem somos</span>
            <h2>Por que clientes confiam na Patrick Serviços Gerais</h2>
            <p>
              Somos uma empresa de manutenção residencial que atua em Florianópolis/SC, oferecendo serviços gerais
              e instalação de tecnologia para casa em um só atendimento.
            </p>
            <p>
              Trabalhamos com equipamento incluso no serviço, sem necessidade de contratar mais de um prestador
              para resolver problemas diferentes na mesma casa.
            </p>
            <div className="badges">
              <div className="badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Atendimento humanizado
              </div>
              <div className="badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Orçamento sem compromisso
              </div>
              <div className="badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Equipamento incluso
              </div>
            </div>
          </div>
          <div className="sobre-art">
            <img
              src="/exemplos/patrick/patrick-servicos.png"
              alt="Profissional Patrick Serviços Gerais realizando manutenção residencial"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 20%',
                borderRadius: '16px',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Trabalhos realizados</span>
            <h2>Alguns dos nossos serviços</h2>
          </div>
          <div className="port-grid">
            <div className="port-card">
              <img src="/exemplos/patrick/portfolio-pintura.png" alt="Pintura e restauração residencial" loading="lazy" />
              <div className="port-label">Pintura e restauração</div>
            </div>
            <div className="port-card">
              <img
                src="/exemplos/patrick/portfolio-cameras.png"
                alt="Instalação de câmeras e monitoramento"
                loading="lazy"
              />
              <div className="port-label">Câmeras e monitoramento</div>
            </div>
            <div className="port-card">
              <img src="/exemplos/patrick/portfolio-moveis.png" alt="Montagem de móveis" loading="lazy" />
              <div className="port-label">Montagem de móveis</div>
            </div>
            <div className="port-card">
              <img src="/exemplos/patrick/portfolio-som.png" alt="Instalação de som ambiente" loading="lazy" />
              <div className="port-label">Som ambiente</div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2>FAQ</h2>
          </div>
          <div>
            <details className="faq-item" open>
              <summary>Como funciona o orçamento?</summary>
              <p>
                Você preenche o formulário com uma descrição e, se possível, fotos do que precisa. A partir disso,
                retornamos com uma estimativa de valor e prazo.
              </p>
            </details>
            <details className="faq-item">
              <summary>Vocês fornecem os equipamentos?</summary>
              <p>Sim. Para câmeras, wi-fi, TV a cabo e som ambiente, o equipamento está incluso no serviço.</p>
            </details>
            <details className="faq-item">
              <summary>Qual o prazo de atendimento?</summary>
              <p>
                Varia conforme o tipo de serviço e a agenda. Após o envio do pedido, o prazo é confirmado
                diretamente com você.
              </p>
            </details>
            <details className="faq-item">
              <summary>Em qual região vocês atendem?</summary>
              <p>Florianópolis/SC e região. Confirme sua localização ao enviar o pedido de orçamento.</p>
            </details>
            <details className="faq-item">
              <summary>Quais as formas de pagamento?</summary>
              <p>Combinadas diretamente com você no momento do orçamento.</p>
            </details>
          </div>
        </div>
      </section>

      <section id="orcamento" className="form-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Pedir orçamento</span>
            <h2>Conte o que você precisa</h2>
            <p>
              Preencha os dados abaixo. Ao enviar, o WhatsApp abre com sua mensagem pronta — é só anexar as fotos
              na conversa e mandar.
            </p>
          </div>
          <form id="orcamento-form">
            <div className="form-grid">
              <div>
                <label htmlFor="nome">Seu nome</label>
                <input type="text" id="nome" required />
              </div>
              <div>
                <label htmlFor="bairro">Bairro / região</label>
                <input type="text" id="bairro" required />
              </div>
              <div className="full">
                <label htmlFor="servico">Serviço desejado</label>
                <select id="servico" required>
                  <option value="">Selecione</option>
                  <option>Pintura e restauração</option>
                  <option>Câmeras e monitoramento</option>
                  <option>Wi-Fi e rede</option>
                  <option>Montagem de móveis</option>
                  <option>TV a cabo</option>
                  <option>Som ambiente</option>
                  <option>Outro / não sei ainda</option>
                </select>
              </div>
              <div className="full">
                <label htmlFor="descricao">Descreva o que precisa</label>
                <textarea id="descricao" required></textarea>
              </div>
              <div className="full">
                <label htmlFor="fotos">Fotos (opcional)</label>
                <input type="file" id="fotos" accept="image/*" multiple />
                <div id="file-list"></div>
                <p className="file-hint">
                  As fotos não são enviadas automaticamente por aqui. Depois de clicar em &quot;Enviar pedido&quot;,
                  o WhatsApp abre com sua mensagem pronta — anexe as fotos direto na conversa.
                </p>
              </div>
            </div>
            <div className="form-foot">
              <button type="submit" className="btn btn-primary btn-lg">Enviar pedido pelo WhatsApp</button>
            </div>
          </form>
        </div>
      </section>

      <section id="contato">
        <div className="wrap">
          <div className="cta-final">
            <div>
              <h2>Pronto para começar?</h2>
              <p>Fale agora e receba retorno rápido.</p>
            </div>
            <a
              href="https://wa.me/554891158924?text=Ol%C3%A1%2C%20vamos%20conversar%3F"
              className="btn btn-whats btn-lg"
            >
              Falar no WhatsApp
            </a>
          </div>
          <div className="contato-grid">
            <div className="contato-item">
              <h5>Endereço</h5>
              <p>Bairro Ingleses, Florianópolis/SC</p>
            </div>
            <div className="contato-item">
              <h5>Horário</h5>
              <p>Agendamento personalizado</p>
            </div>
            <div className="contato-item">
              <h5>WhatsApp</h5>
              <p>(48) 9115-8924*</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div>
            <a href="#" className="logo-word" aria-label="Patrick Serviços Gerais">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 230 60"
                aria-labelledby="logoTitleFooter"
                role="img"
                style={{ height: '40px', width: 'auto', display: 'block' }}
              >
                <title id="logoTitleFooter">Patrick Serviços Gerais</title>
                <g>
                  <path
                    d="M6,42 L30,15 L54,42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    fillRule="evenodd"
                    fill="#D9720A"
                    d="M30,37 L36.5,40.5 L36.5,47.5 L30,51 L23.5,47.5 L23.5,40.5 Z
                 M32.7,44 A2.7,2.7 0 1 1 27.3,44 A2.7,2.7 0 1 1 32.7,44 Z"
                  />
                </g>
                <g transform="translate(70,0)">
                  <text
                    x="0"
                    y="28"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontSize="26"
                    fontWeight="700"
                    fill="currentColor"
                    transform="scale(0.92,1)"
                  >
                    Patrick
                  </text>
                  <text
                    x="0"
                    y="46"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontSize="10"
                    fontWeight="600"
                    letterSpacing="2.5"
                    fill="#D9720A"
                  >
                    SERVIÇOS GERAIS
                  </text>
                </g>
              </svg>
            </a>
            <p
              style={{
                fontSize: '12.5px',
                marginTop: '12px',
                maxWidth: '240px',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              Manutenção residencial e serviços gerais. Florianópolis/SC.
            </p>
          </div>
          <div className="foot-col">
            <h5>Links rápidos</h5>
            <a href="#servicos">Serviços</a>
            <a href="#sobre">Sobre</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="foot-col">
            <h5>Contato</h5>
            <a href="https://wa.me/554891158924">WhatsApp — (48) 9115-8924*</a>
            <p>CNPJ 44.653.474/0001-08</p>
          </div>
        </div>
        <div className="wrap foot-bottom">
          <span id="year-copy">© Patrick Serviços Gerais</span>
          <span>Site desenvolvido com cuidado</span>
        </div>
      </footer>

      <a href="https://wa.me/554891158924" className="float-whats" aria-label="Falar no WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" />
        </svg>
      </a>

      <PatrickScripts />
    </>
  )
}
