import "./globals.css"

export const metadata = {
  title: "Curso de Precificação Médica | Dr. Fábio Rodrigues",
  description:
    "Aprenda a precificar consultas médicas com método, proteger margem e comunicar valor com mais segurança na medicina particular.",
  openGraph: {
    title: "Curso de Precificação Médica | Dr. Fábio Rodrigues",
    description:
      "Uma formação prática da X5 Med para médicos que querem parar de cobrar no escuro e tomar decisões de preço com mais clareza.",
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
