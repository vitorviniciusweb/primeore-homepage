import Image from 'next/image'
import { FaInstagram, FaFacebookF, FaWhatsapp } from 'react-icons/fa'
import './ocean-store.css'

const colors = [
  { name: 'Azul-marinho', hex: '#0B2A4A', use: 'Cor primária' },
  { name: 'Vermelho vibrante', hex: '#D42027', use: 'Cor de destaque' },
  { name: 'Branco', hex: '#FFFFFF', use: 'Cor de contraste' },
  { name: 'Cinza de apoio', hex: '#4A4A4A', use: 'Textos secundários' },
]

const rules = [
  'Não distorcer a proporção da logo (nunca esticar ou achatar).',
  'Não trocar as cores originais por outras combinações.',
  'Não aplicar sobre fundos de baixo contraste (fotos claras, texturas ou cores próximas ao azul-marinho).',
  'Respeitar uma margem de proteção mínima ao redor da logo, sem outros elementos colados nela.',
]

const products = [
  { name: 'Camiseta Ocean Basic', price: 'R$ 89,90', color: '#0B2A4A' },
  { name: 'Boné Trucker Maré', price: 'R$ 69,90', color: '#D42027' },
  { name: 'Jaqueta Windbreaker Baía', price: 'R$ 249,90', color: '#4A4A4A' },
  { name: 'Shorts Praia Listrado', price: 'R$ 119,90', color: '#123A63' },
  { name: 'Regata Areia', price: 'R$ 79,90', color: '#D42027' },
  { name: 'Boné Aba Curva Ocean', price: 'R$ 59,90', color: '#0B2A4A' },
]

export default function OceanStorePage() {
  return (
    <main>
      {/* 1. Hero */}
      <section className="os-hero">
        <div className="wrap">
          <Image
            src="/ocean-store/logo.png"
            alt="Ocean Store"
            width={1901}
            height={995}
            className="os-hero-logo"
            priority
          />
          <h1>Ocean Store</h1>
          <p className="os-slogan">Da praia, pra praia.</p>
          <span className="os-caption">Mapa de Identidade Visual · Julho 2026</span>
        </div>
      </section>

      {/* 2. Sobre a marca */}
      <section className="os-section os-about">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Sobre a marca</h2>
          </div>
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

      {/* 3. Paleta de cores */}
      <section className="os-section os-section--soft">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Paleta de cores</h2>
            <p>As quatro cores oficiais da marca, com o uso recomendado de cada uma.</p>
          </div>
          <div className="os-color-grid">
            {colors.map((color) => (
              <div className="os-color-card" key={color.hex}>
                <div
                  className="os-color-swatch"
                  style={{
                    backgroundColor: color.hex,
                    border: color.hex === '#FFFFFF' ? '1px solid var(--os-line)' : 'none',
                  }}
                />
                <div className="os-color-info">
                  <span className="os-color-name">{color.name}</span>
                  <span className="os-color-hex">{color.hex}</span>
                  <span className="os-color-use">{color.use}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tipografia */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Tipografia</h2>
            <p>Duas famílias tipográficas cobrem toda a comunicação da marca.</p>
          </div>
          <div className="os-type-grid">
            <div className="os-type-card">
              <span className="os-type-label">Títulos e destaques</span>
              <div className="os-type-sample-display">OCEAN STORE</div>
              <p className="os-type-meta">
                <strong>Bebas Neue</strong> — condensada, bold, sempre em caixa alta. Usar
                em títulos, chamadas e destaques curtos.
              </p>
            </div>
            <div className="os-type-card">
              <span className="os-type-label">Corpo de texto</span>
              <p className="os-type-sample-body">
                Roupas de praia pensadas pra quem vive o mar todos os dias.
              </p>
              <p className="os-type-meta">
                <strong>Work Sans</strong> — pesos 400 e 600. Usar em textos corridos,
                descrições e navegação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Aplicações e uso */}
      <section className="os-section os-section--soft">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Aplicações e uso</h2>
            <p>Exemplos de como a logo aparece em diferentes pontos de contato.</p>
          </div>
          <div className="os-app-grid">
            <div className="os-app-card">
              <div className="os-mock-tag">
                <Image
                  src="/ocean-store/logo.png"
                  alt="Etiqueta Ocean Store"
                  width={1901}
                  height={995}
                />
              </div>
              <span className="os-app-label">Etiqueta de roupa</span>
            </div>
            <div className="os-app-card">
              <div className="os-mock-ig">
                <Image
                  src="/ocean-store/logo.png"
                  alt="Post de Instagram Ocean Store"
                  width={1901}
                  height={995}
                />
              </div>
              <span className="os-app-label">Post de Instagram</span>
            </div>
            <div className="os-app-card">
              <div className="os-mock-header">
                <div className="os-mock-header-bar">
                  <Image
                    src="/ocean-store/logo.png"
                    alt="Cabeçalho de site Ocean Store"
                    width={1901}
                    height={995}
                  />
                  <div className="os-mock-header-nav">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className="os-mock-header-body" />
              </div>
              <span className="os-app-label">Topo de cabeçalho de site</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Regras de uso da logo */}
      <section className="os-section">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Regras de uso da logo</h2>
            <p>Poucas regras, mas importantes pra manter a marca consistente.</p>
          </div>
          <ul className="os-rules">
            {rules.map((rule) => (
              <li key={rule}>
                <span className="os-rule-mark">✕</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Pré-visualização do e-commerce */}
      <section className="os-section os-section--soft">
        <div className="wrap">
          <div className="os-section-head">
            <h2>Pré-visualização do e-commerce</h2>
            <p>
              Simulação visual de como a identidade fica aplicada numa loja virtual —
              layout ilustrativo, sem funcionalidade real.
            </p>
          </div>
          <div className="os-shop">
            <div className="os-shop-header">
              <Image
                src="/ocean-store/logo.png"
                alt="Ocean Store"
                width={1901}
                height={995}
              />
              <nav className="os-shop-nav">
                <span>Início</span>
                <span>Masculino</span>
                <span>Feminino</span>
                <span>Ofertas</span>
                <span>Contato</span>
              </nav>
            </div>

            <div className="os-shop-banner">
              <h3>Da praia, pra praia.</h3>
              <span className="os-shop-btn">Ver coleção</span>
            </div>

            <div className="os-shop-products">
              {products.map((product) => (
                <div className="os-shop-product" key={product.name}>
                  <div
                    className="os-shop-product-photo"
                    style={{ backgroundColor: product.color }}
                  />
                  <div className="os-shop-product-name">{product.name}</div>
                  <div className="os-shop-product-price">{product.price}</div>
                </div>
              ))}
            </div>

            <div className="os-shop-footer">
              <div className="os-shop-social">
                <span>
                  <FaInstagram />
                </span>
                <span>
                  <FaFacebookF />
                </span>
                <span>
                  <FaWhatsapp />
                </span>
              </div>
              <p>
                WhatsApp: <strong>(13) 99705-5302</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
