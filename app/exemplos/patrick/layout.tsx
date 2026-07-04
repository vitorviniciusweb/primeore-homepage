import { Barlow_Condensed, Work_Sans } from 'next/font/google'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-work',
  display: 'swap',
})

export default function PatrickLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`patrick-root ${barlowCondensed.variable} ${workSans.variable}`}
      style={{ margin: 0, padding: 0 }}
    >
      {children}
    </div>
  )
}

export const metadata = {
  title: 'Patrick Serviços Gerais — Manutenção Residencial em Florianópolis/SC',
  description: 'Manutenção residencial, instalação de câmeras, wi-fi, montagem de móveis e mais. Atendimento em Florianópolis/SC.',
}
