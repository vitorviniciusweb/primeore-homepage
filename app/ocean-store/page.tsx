import Image from 'next/image'
import './ocean-store.css'

const colors = [
  { name: 'Azul-Marinho', hex: '#0B2A4A', use: 'Cor primária' },
  { name: 'Vermelho Vibrante', hex: '#D42027', use: 'Cor de destaque' },
  { name: 'Branco', hex: '#FFFFFF', use: 'Cor de contraste' },
  { name: 'Cinza de Apoio', hex: '#4A4A4A', use: 'Textos secundários' },
]

const rules = [
  'Não distorcer a proporção da logo (nunca esticar ou achatar).',
  'Não trocar as cores originais por outras combinações.',
  'Não aplicar sobre fundos de baixo contraste (fotos claras, texturas ou cores próximas ao azul-marinho).',
  'Respeitar uma margem de proteção mínima ao redor da logo, sem outros elementos colados nela.',
]

const products = [
  { name: 'Camiseta Ocean Basic', price: 'R$ 89,90', image: 'camiseta-ocean-basic.jpg' },
  { name: 'Boné Trucker Maré', price: 'R$ 69,90', image: 'bone-trucker-mare.jpg' },
  { name: 'Jaqueta Windbreaker Baía', price: 'R$ 249,90', image: 'jaqueta-windbreaker-baia.jpg' },
  { name: 'Shorts Praia Listrado', price: 'R$ 119,90', image: 'shorts-praia-listrado.jpg' },
  { name: 'Regata Areia', price: 'R$ 79,90', image: 'regata-areia.jpg' },
  { name: 'Boné Aba Curva Ocean', price: 'R$ 59,90', image: 'bone-aba-curva-ocean.jpg' },
]

export default function OceanStorePage() {
  return (
    <>
      <nav className="os-nav">
        <div className="os-wrap">
          <div className="os-brand">
            OCEAN <span>STORE</span>
          </div>
          <ul>
            <li>
              <a href="#marca">Marca</a>
            </li>
            <li>
              <a href="#paleta">Paleta</a>
            </li>
            <li>
              <a href="#tipografia">Tipografia</a>
            </li>
            <li>
              <a href="#aplicacoes">Aplicações</a>
            </li>
            <li>
              <a href="#regras">Regras de uso</a>
            </li>
            <li>
              <a href="#ecommerce">E-commerce</a>
            </li>
          </ul>
        </div>
      </nav>

      <header className="os-hero">
        <div className="os-wrap">
          <Image
            className="os-logo-mark"
            src="/ocean-store/ocean-store-logo.png"
            alt="Logo Ocean Store"
            width={1901}
            height={995}
            priority
          />
          <h1>OCEAN STORE</h1>
          <div className="os-slogan">Da praia, pra praia.</div>
          <div className="os-eyebrow">Mapa de Identidade Visual · Julho 2026</div>
        </div>
      </header>

      <section id="marca" className="os-sobre">
        <div className="os-wrap">
          <div className="os-kicker">A marca</div>
          <h2 className="os-sec-title">Sobre a Ocean Store</h2>
          <p>
            Ocean Store é a loja de roupas de praia da Baixada Santista, com base em
            Santos e atendimento em Santos, São Vicente e Guarujá. O catálogo reúne
            moda praia e surf pensado pra quem vive perto do mar.
          </p>
          <p>
            O diferencial está no atendimento: peças sob encomenda pra quem quer algo
            além da prateleira, jaquetas de pronta entrega pra quem não pode esperar, e
            entrega rápida pra toda a região.
          </p>
          <p>
            O público é gente de vida ativa na praia — surf, natação, canoagem, corrida
            na areia — homens e mulheres de 15 a 40 anos. Este documento reúne a leitura
            visual básica da marca nesta fase inicial de validação: logotipo, paleta,
            tipografia e regras simples de uso, o suficiente pra dar consistência às
            primeiras peças, posts e pontos de contato.
          </p>
        </div>
      </section>

      <section id="paleta" className="os-paleta">
        <div className="os-wrap">
          <div className="os-kicker">Cores</div>
          <h2 className="os-sec-title">Paleta de cores</h2>
          <p className="os-lede">
            As quatro cores oficiais da marca, com o uso recomendado de cada uma.
          </p>
          <div className="os-swatches">
            {colors.map((color) => (
              <div className="os-swatch" key={color.hex}>
                <div
                  className="os-block"
                  style={{
                    background: color.hex,
                    borderBottom: color.hex === '#FFFFFF' ? '1px solid #eee' : undefined,
                  }}
                />
                <div className="os-label">
                  <strong>{color.name}</strong>
                  <span>{color.hex}</span>
                  <small>{color.use}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tipografia">
        <div className="os-wrap">
          <div className="os-kicker">Tipografia</div>
          <h2 className="os-sec-title">Duas famílias cobrem tudo</h2>
          <p className="os-lede">
            Duas famílias tipográficas cobrem toda a comunicação da marca.
          </p>
          <div className="os-type-row">
            <div className="os-type-card">
              <div className="os-tag">Títulos e destaques</div>
              <div className="os-sample">OCEAN STORE</div>
              <hr className="os-rule" />
              <p className="os-note">
                <strong>Bebas Neue</strong> — condensada, bold, sempre em caixa alta.
                Usar em títulos, chamadas e destaques curtos.
              </p>
            </div>
            <div className="os-type-card os-body">
              <div className="os-tag">Corpo de texto</div>
              <div className="os-sample">
                Roupas de praia pensadas pra quem vive o mar todos os dias.
              </div>
              <hr className="os-rule" />
              <p className="os-note">
                <strong>Work Sans</strong> — pesos 400 e 600. Usar em textos corridos,
                descrições e navegação.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="aplicacoes" className="os-aplicacoes">
        <div className="os-wrap">
          <div className="os-kicker">Uso da marca</div>
          <h2 className="os-sec-title">Aplicações e uso</h2>
          <p className="os-lede">
            Exemplos de como a logo aparece em diferentes pontos de contato.
          </p>
          <div className="os-app-grid">
            <div className="os-app-card">
              <div className="os-app-visual">
                <div className="os-tag-mock">
                  <Image
                    src="/ocean-store/ocean-store-logo.png"
                    alt="Logo em etiqueta"
                    width={1901}
                    height={995}
                  />
                </div>
              </div>
              <div className="os-app-caption">
                <strong>Etiqueta de roupa</strong>
              </div>
            </div>
            <div className="os-app-card">
              <div className="os-app-visual">
                <div className="os-insta-mock">
                  <Image
                    src="/ocean-store/ocean-store-logo.png"
                    alt="Logo em post"
                    width={1901}
                    height={995}
                  />
                </div>
              </div>
              <div className="os-app-caption">
                <strong>Post de Instagram</strong>
              </div>
            </div>
            <div className="os-app-card">
              <div className="os-app-visual" style={{ alignItems: 'flex-start', background: '#fff' }}>
                <div className="os-header-mock">
                  <div className="os-bar">
                    <Image
                      src="/ocean-store/ocean-store-logo.png"
                      alt="Logo no cabeçalho"
                      width={1901}
                      height={995}
                    />
                    <div className="os-lines">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                  <div className="os-body" />
                </div>
              </div>
              <div className="os-app-caption">
                <strong>Topo de cabeçalho de site</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="regras">
        <div className="os-wrap">
          <div className="os-kicker">Boas práticas</div>
          <h2 className="os-sec-title">Regras de uso da logo</h2>
          <p className="os-lede">
            Poucas regras, mas importantes pra manter a marca consistente.
          </p>
          <div className="os-regras">
            {rules.map((rule) => (
              <div className="os-regra" key={rule}>
                <div className="os-x">✕</div>
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ecommerce" className="os-aplicacoes">
        <div className="os-wrap">
          <div className="os-kicker">Simulação</div>
          <h2 className="os-sec-title">Pré-visualização do e-commerce</h2>
          <p className="os-ecom-note">
            Layout ilustrativo, sem funcionalidade real — apenas para visualizar a
            identidade aplicada a uma loja virtual, com fotos reais geradas para cada
            peça.
          </p>
          <div className="os-ecom-frame">
            <div className="os-ecom-header">
              <Image
                src="/ocean-store/ocean-store-logo.png"
                alt="Logo Ocean Store"
                width={1901}
                height={995}
              />
              <ul>
                <li>
                  <span>Início</span>
                </li>
                <li>
                  <span>Masculino</span>
                </li>
                <li>
                  <span>Feminino</span>
                </li>
                <li>
                  <span>Ofertas</span>
                </li>
                <li>
                  <span>Contato</span>
                </li>
              </ul>
            </div>
            <div className="os-ecom-hero">
              <h3>DA PRAIA, PRA PRAIA.</h3>
              <button type="button">VER COLEÇÃO</button>
            </div>
            <div className="os-prod-grid">
              {products.map((product) => (
                <div className="os-prod-card" key={product.name}>
                  <div className="os-img-wrap">
                    <Image
                      src={`/ocean-store/${product.image}`}
                      alt={product.name}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
                    />
                  </div>
                  <div className="os-info">
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="os-ecom-footer">
              <div className="os-socials">
                <span>IG</span>
                <span>FB</span>
                <span>WA</span>
              </div>
              <p>WhatsApp: (13) 99705-5302</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="os-site-footer">
        <div className="os-wrap">
          <strong>OCEAN STORE</strong>
          Mapa de Identidade Visual · Preparado por Vitor Vinícius
        </div>
      </footer>
    </>
  )
}
