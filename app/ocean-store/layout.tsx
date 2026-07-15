import type { Metadata } from 'next'
import { Bebas_Neue, Work_Sans } from 'next/font/google'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-os-display',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-os-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ocean Store — Identidade Visual',
  description:
    'Loja de roupas de praia da Baixada Santista. Da praia, pra praia.',
  openGraph: {
    title: 'Ocean Store — Identidade Visual',
    description:
      'Loja de roupas de praia da Baixada Santista. Da praia, pra praia.',
    url: 'https://primeore.com.br/ocean-store',
    siteName: 'Ocean Store',
    images: [
      {
        url: 'https://primeore.com.br/ocean-store/ocean-store-logo.png',
        width: 1901,
        height: 995,
        alt: 'Ocean Store',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ocean Store — Identidade Visual',
    description:
      'Loja de roupas de praia da Baixada Santista. Da praia, pra praia.',
    images: ['https://primeore.com.br/ocean-store/ocean-store-logo.png'],
  },
}

export default function OceanStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`os-root ${bebasNeue.variable} ${workSans.variable}`}
      style={{ margin: 0, padding: 0 }}
    >
      {children}
    </div>
  )
}
