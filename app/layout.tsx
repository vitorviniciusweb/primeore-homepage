import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Primeore | Sites Profissionais para Empresários — Santos/SP",
  description:
    "Chega de site genérico que não representa seu negócio. Criamos sites institucionais com identidade visual exclusiva, copy para o Google e estrutura pronta para crescer — Santos/SP.",
  openGraph: {
    title: "Primeore | Sites Profissionais para Empresários — Santos/SP",
    description:
      "Chega de site genérico que não representa seu negócio. Criamos sites institucionais com identidade visual exclusiva, copy para o Google e estrutura pronta para crescer — Santos/SP.",
    url: "https://primeore.com.br",
    siteName: "Primeore",
    images: [
      {
        url: "https://primeore.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "Primeore — Sites profissionais para empresários",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Primeore | Sites Profissionais para Empresários — Santos/SP",
    description:
      "Chega de site genérico que não representa seu negócio. Criamos sites institucionais com identidade visual exclusiva, copy para o Google e estrutura pronta para crescer — Santos/SP.",
    images: ["https://primeore.com.br/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K5QK4XRG');
        `}</Script>
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5QK4XRG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
