import "./globals.css"
import { Inter, Sora } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
})

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["600", "700", "800"],
})

export const metadata = {
  title: "Curso de Precificação Médica | Dr. Fábio Rodrigues",
  description:
    "Aprenda a precificar consultas médicas com método, proteger margem e comunicar valor com mais segurança na medicina particular.",
  icons: {
    icon: "/assets/Logo%20X5%20Med%20Branca.png",
    shortcut: "/assets/Logo%20X5%20Med%20Branca.png",
    apple: "/assets/Logo%20X5%20Med%20Branca.png",
  },
  openGraph: {
    title: "Curso de Precificação Médica | Dr. Fábio Rodrigues",
    description:
      "Uma formação prática da X5 Med para médicos que querem parar de cobrar no escuro e tomar decisões de preço com mais clareza.",
    type: "website",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  )
}
