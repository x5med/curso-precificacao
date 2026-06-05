"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { registrarInscricao } from "./actions"
import HologramScore from "./HologramScore"

// TODO: substituir pelo numero real no formato DDI+DDD+numero, somente digitos. Ex.: 5511999999999
const WHATSAPP_NUMBER = "5511999999999"

function Icon({ name }) {
  const paths = {
    arrow: <path d="M5 12h14M14 6l6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    shield: <path d="M12 3 5 6v5c0 4.4 2.8 8.5 7 10 4.2-1.5 7-5.6 7-10V6l-7-3Z" />,
    chart: <path d="M4 19V5M4 19h16M8 15l3-4 3 2 4-7" />,
    stethoscope: <path d="M6 4v5a4 4 0 0 0 8 0V4M4 4h4M12 4h4M14 15a4 4 0 0 0 8 0v-2M22 13a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />,
    calculator: <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4h6M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />,
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
    play: <path d="M8 5v14l11-7-11-7Z" />,
    target: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
    phone: <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 15h2" />,
    calendar: <path d="M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />,
    clock: <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
    monitor: <path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM9 21h6M12 17v4" />,
    quote: <path d="M7 7h4v4c0 3-1.5 5-4 6M13 7h4v4c0 3-1.5 5-4 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />,
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

// Divisor em onda entre dobras: preenchimento (cor da secao via data-surface) + fio de luz na crista.
function Wave() {
  const curve = "M0,30 C240,2 480,2 720,26 C960,50 1200,50 1440,24"
  return (
    <svg className="section-wave" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
      <path className="wave-fill" d={`${curve} L1440,56 L0,56 Z`} />
      <path className="wave-line" d={curve} />
    </svg>
  )
}

function WhiteDivider() {
  return <img className="section-divider-white" src="/assets/divisoria-branca.svg" alt="" aria-hidden="true" />
}

// Gera um caminho de onda senoidal suave (usado na "fita de onda").
function buildWave(mid, { amp = 12, period = 880, from = -160, to = 1920 } = {}) {
  const half = period / 2
  let d = `M ${from} ${mid}`
  let first = true
  for (let x = from; x < to; x += half) {
    const ex = x + half
    if (first) {
      d += ` Q ${x + half / 2} ${mid - amp} ${ex} ${mid}`
      first = false
    } else {
      d += ` T ${ex} ${mid}`
    }
  }
  return d
}

const RIBBON_PERIOD = 880
const RIBBON_TILES = 6
const RIBBON_WORDS = ["Diagnóstico", "Margem", "Método", "Precificação"]
const ribbonTopPath = buildWave(42, { amp: 14 })
const ribbonBottomPath = buildWave(118, { amp: 14 })
// Bordas e texto compartilham a MESMA fase (mesmo period/from), então o texto acompanha a ondulação.
const ribbonTextPath = buildWave(80, { amp: 14, from: -160, to: 2080 })
// Preenchem os cantos: acima da onda = cor da hero; abaixo da onda = cor da 2ª dobra.
// Assim a divisão entre as dobras acontece exatamente nas bordas onduladas da fita.
const ribbonTopFill = `${ribbonTopPath} L 2040 0 L -160 0 Z`
const ribbonBottomFill = `${ribbonBottomPath} L 2040 160 L -160 160 Z`

function WaveRibbon() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  return (
    <div className="wave-ribbon" aria-hidden="true">
      <svg className="ribbon-svg" viewBox="0 0 1760 160" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="ribbonTextPath" d={ribbonTextPath} />
          <linearGradient id="ribbonGlass" gradientUnits="userSpaceOnUse" x1="0" y1="28" x2="0" y2="132">
            <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.10)" />
          </linearGradient>
        </defs>
        <path className="ribbon-fill-top" d={ribbonTopFill} />
        <path className="ribbon-fill-bottom" d={ribbonBottomFill} />
        <path className="ribbon-glass" d={ribbonTextPath} />
        <path className="ribbon-line" d={ribbonTopPath} />
        <path className="ribbon-line" d={ribbonBottomPath} />
        <text
            className="ribbon-text"
            textLength={RIBBON_TILES * RIBBON_PERIOD}
            lengthAdjust="spacing"
            dominantBaseline="middle"
          >
            <textPath href="#ribbonTextPath" startOffset="0">
              {Array.from({ length: RIBBON_TILES }).flatMap((_, tile) =>
                RIBBON_WORDS.map((word, i) => (
                  <tspan key={`${tile}-${i}`}>
                    {word}
                    <tspan className="ribbon-dot">{" • "}</tspan>
                  </tspan>
                ))
              )}
            {animate ? (
              <animate
                attributeName="startOffset"
                from="0"
                to={-RIBBON_PERIOD}
                dur="30s"
                repeatCount="indefinite"
              />
            ) : null}
            </textPath>
          </text>
      </svg>
    </div>
  )
}

// Contador que sobe de 0 ate o valor quando entra na tela.
function CountUp({ to, duration = 1300, prefix = "", suffix = "", className }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to)
      return
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          obs.unobserve(entry.target)
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(to * eased))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("pt-BR")}
      {suffix}
    </span>
  )
}

// Selo circular com texto rotativo e nucleo glass.
function RotatingSeal() {
  const rotorRef = useRef(null)

  useEffect(() => {
    const rotor = rotorRef.current
    if (!rotor) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const update = () => {
      raf = 0
      rotor.style.transform = `rotate(${window.scrollY * 0.18}deg)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="seal" aria-hidden="true">
      <div className="seal-rotor" ref={rotorRef}>
        <svg className="seal-text" viewBox="0 0 120 120">
          <defs>
            <path id="sealPath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text>
            <textPath href="#sealPath" startOffset="0">
              X5 MED · PRECIFICAÇÃO MÉDICA · MÉTODO ·&nbsp;
            </textPath>
          </text>
        </svg>
      </div>
      <span className="seal-core">
        <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="" />
      </span>
    </div>
  )
}

const diagnostics = [
  {
    title: "Defino meu preço olhando o que os colegas cobram.",
    cue: "Preço guiado pelo mercado, não pela sua operação.",
    icon: "target",
  },
  {
    title: "Não sei minha margem real por hora de atendimento.",
    cue: "Agenda cheia pode esconder lucro fraco.",
    icon: "calculator",
  },
  {
    title: "Adio reajustes porque a conversa é desconfortável.",
    cue: "Falta critério, timing e argumento para conduzir.",
    icon: "pulse",
  },
  {
    title: "Meu paciente vê a técnica, mas não percebe o valor.",
    cue: "A experiência não sustenta o preço com clareza.",
    icon: "stethoscope",
  },
]

const methodSteps = [
  ["01", "Diagnosticar", "Custos, agenda e rotina entram antes de qualquer preço.", "target"],
  ["02", "Precificar", "Honorário passa a considerar margem, posicionamento e demanda.", "calculator"],
  ["03", "Comunicar", "Valor é explicado sem pressão comercial e sem improviso.", "stethoscope"],
  ["04", "Reajustar", "A revisão ganha critério, cadência e conversa mais segura.", "pulse"],
]

const transformations = [
  ["Antes", "Cobrar olhando o mercado", "Depois", "Decidir com margem e critério"],
  ["Antes", "Reajuste travado por receio", "Depois", "Argumento claro para conduzir a conversa"],
  ["Antes", "Agenda cheia sem sobra", "Depois", "Leitura objetiva da sustentabilidade"],
]

const proofPoints = [
  ["Recorte médico", "Consulta, honorários, margem e medicina particular."],
  ["Comunicação ética", "Sem promessa de faturamento e sem pressão sobre paciente."],
  ["Aplicação prática", "Ferramentas para revisar preço, não conceitos soltos."],
]

// TODO: substituir por depoimentos reais e autorizados (texto, nome e especialidade).
const testimonials = [
  ["Passei a entender minha margem real por horário e finalmente reajustei com critério.", "Dra. Ana Luiza M.", "Dermatologia"],
  ["Parei de cobrar olhando o colega. Hoje a decisão de preço tem método e segurança.", "Dr. Henrique R.", "Ortopedia"],
  ["A conversa de reajuste deixou de ser desconfortável — tenho argumento e clareza.", "Dra. Camila T.", "Pediatria"],
  ["Enxerguei horários que pareciam cheios mas tinham margem fraca. Mudou minha agenda.", "Dr. Rafael S.", "Cardiologia"],
  ["O paciente passou a perceber valor sem eu precisar baixar preço para fechar.", "Dra. Mariana C.", "Ginecologia"],
  ["Hoje tenho critério para revisar honorário sem culpa e sem improviso.", "Dr. Bruno L.", "Clínica geral"],
]

// TODO: definir os valores reais da oferta (ou trocar por modelo "falar com o time").
const OFFER = {
  fromPrice: "R$ 1.997",
  priceValue: 297,
  installment: "à vista ou 12x de R$ 30,72",
}

// TODO: ajustar conforme a logistica real da turma.
const logistics = [
  ["calendar", "Próxima turma", "Datas divulgadas após a inscrição"],
  ["monitor", "Formato", "100% online, ao vivo com gravação"],
  ["clock", "Carga", "Encontros objetivos e aplicáveis"],
  ["phone", "Acesso", "Link enviado pelo WhatsApp"],
]

const offerIncludes = [
  "Trilha completa de precificação médica",
  "Ferramentas de margem e de reajuste",
  "Roteiro de comunicação de valor ao paciente",
  "Acompanhamento e atualizações da turma",
]

const outcomes = [
  "Clareza para definir honorários",
  "Menos comparação por preço",
  "Mais segurança para falar de valor",
  "Leitura melhor de margem",
  "Critério para reajustar",
  "Posicionamento mais coerente",
]

const faq = [
  ["Serve para consultório pequeno?", "Sim. A trilha foi pensada para médicos que atendem no particular, com ou sem clínica grande."],
  ["Preciso aumentar preço imediatamente?", "Não. A primeira decisão é entender margem, custo e valor percebido antes de qualquer reajuste."],
  ["É um treinamento de vendas?", "Não. O foco é precificação, posicionamento e comunicação de valor com responsabilidade."],
  ["Existe promessa de faturamento?", "Não. Resultado financeiro depende da realidade de cada operação. A promessa é método de decisão."],
]

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
})

export default function LandingExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [checked, setChecked] = useState(() => new Set([0, 1]))
  const [price, setPrice] = useState(450)
  const [appointments, setAppointments] = useState(22)
  const [cost, setCost] = useState(170)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState("")
  const [signupOpen, setSignupOpen] = useState(false)
  const [heroPlaying, setHeroPlaying] = useState(false)
  const heroRef = useRef(null)
  const heroVideoRef = useRef(null)
  const heroMediaRef = useRef(null)

  useEffect(() => {
    if (!menuOpen && !signupOpen) return
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen, signupOpen])

  useEffect(() => {
    if (!signupOpen) return
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSignupOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [signupOpen])

  useEffect(() => {
    const items = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const video = heroVideoRef.current
    if (!hero || !video) return

    // Respeita quem pediu menos movimento: mantem apenas o still.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    video.muted = true

    const play = () => {
      const attempt = video.play()
      if (attempt?.then) attempt.then(() => setHeroPlaying(true)).catch(() => {})
      else setHeroPlaying(true)
    }
    const stop = () => {
      video.pause()
      setHeroPlaying(false)
    }

    // Desktop (tem hover): toca ao passar o mouse, pausa ao sair.
    if (window.matchMedia("(hover: hover)").matches) {
      hero.addEventListener("mouseenter", play)
      hero.addEventListener("mouseleave", stop)
      return () => {
        hero.removeEventListener("mouseenter", play)
        hero.removeEventListener("mouseleave", stop)
      }
    }

    // Mobile/touch (sem hover): autoplay mudo quando a hero esta visivel.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (entry.isIntersecting ? play() : stop())),
      { threshold: 0.4 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const media = heroMediaRef.current
    const hero = heroRef.current
    if (!media || !hero) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const scrolledIntoHero = Math.max(0, -hero.getBoundingClientRect().top)
      media.style.transform = `translate3d(0, ${scrolledIntoHero * 0.18}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const diagnosisLevel =
    checked.size === 0
      ? "Comece marcando os sinais"
      : checked.size >= 3
        ? "Alto risco no seu preço"
        : "Ponto de atenção"
  const diagnosisCopy =
    checked.size === 0
      ? "Selecione ao lado tudo que acontece na sua rotina. Seu resultado aparece aqui na hora."
      : checked.size >= 3
        ? "Hoje você cobra no escuro. A trilha transforma isso em decisão com margem e critério."
        : "Já existem sinais para revisar. Vamos dar critério à margem, ao reajuste e à comunicação."

  const gross = price * appointments * 4
  const monthlyCost = cost * appointments * 4
  const net = Math.max(gross - monthlyCost, 0)
  const margin = useMemo(() => Math.round((net / Math.max(gross, 1)) * 100), [net, gross])

  function toggleDiagnostic(index) {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function openSignup(event) {
    event?.preventDefault()
    setMenuOpen(false)
    setFormError("")
    setSignupOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = (data.get("name") || "").toString().trim()
    const phone = (data.get("phone") || "").toString().trim()
    const email = (data.get("email") || "").toString().trim()

    setPending(true)
    setFormError("")

    const result = await registrarInscricao({ name, phone, email })

    setPending(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }

    const text = [
      "Olá! Quero participar da Trilha de Precificação Médica X5 Med.",
      "",
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      `E-mail: ${email}`,
    ].join("\n")

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener")
    setSubmitted(true)
    form.reset()
  }

  return (
    <div className="landing-shell">
      <div className="bg-orbs" aria-hidden="true">
        <i className="orb orb-cyan" />
        <i className="orb orb-gold" />
        <i className="orb orb-cyan orb-3" />
      </div>

      {/* TODO: ajustar datas/contexto reais da turma. */}
      <div className="context-bar">
        <Icon name="calendar" />
        <span>Próxima turma · Online, ao vivo</span>
        <i aria-hidden="true" />
        <span><Icon name="spark" /> Vagas limitadas</span>
      </div>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="X5 Med">
          <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" width="92" height="42" />
        </a>

        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#diagnostico">Diagnóstico</a>
          <a href="#simulador">Margem</a>
          <a href="#metodo">Método</a>
          <a href="#professor">Professor</a>
          <a href="#inscricao">Inscrição</a>
        </nav>

        <a className="topbar-cta" href="#inscricao" onClick={openSignup}>
          Liberar inscrição <Icon name="arrow" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      <nav className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Navegação mobile" aria-hidden={!menuOpen}>
        {[
          ["#diagnostico", "Diagnóstico"],
          ["#simulador", "Margem"],
          ["#metodo", "Método"],
          ["#professor", "Professor"],
          ["#depoimentos", "Depoimentos"],
          ["#faq", "FAQ"],
        ].map(([href, label]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <a className="btn btn-primary" href="#inscricao" onClick={openSignup}>
          Quero participar <Icon name="arrow" />
        </a>
      </nav>

      <main id="top">
        <section className="hero-section" ref={heroRef}>
          <div ref={heroMediaRef} className={`hero-media${heroPlaying ? " is-playing" : ""}`} aria-hidden="true">
            <img className="hero-still" src="/assets/hero-x5med.png" alt="" />
            <video
              ref={heroVideoRef}
              className="hero-video"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/dr-fabio-poster.jpg"
            >
              <source src="/assets/dr-fabio-hq.mp4" type="video/mp4" />
            </video>
            <span className="hero-cue"><Icon name="play" /> ver apresentação</span>
          </div>

          <div className="hero-grid">
            <div className="hero-copy reveal">
              <span className="section-kicker">Precificação médica particular</span>
              <h1>
                <span>Pare de cobrar no escuro.</span>
                <strong>Decida preço com margem.</strong>
              </h1>
              <p>
                Uma trilha prática para transformar custo, agenda e valor percebido em critério de honorário, sem venda
                agressiva e sem promessa vazia.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#inscricao" onClick={openSignup}>
                  Quero participar <Icon name="arrow" />
                </a>
                <a className="btn btn-secondary" href="#diagnostico">
                  Fazer diagnóstico
                </a>
              </div>
              <div className="trust-row" aria-label="Pilares da trilha">
                <span><Icon name="calculator" /> Margem</span>
                <span><Icon name="shield" /> Ética</span>
                <span><Icon name="chart" /> Critério</span>
              </div>
            </div>
          </div>
        </section>

        <WaveRibbon />

        <section className="diagnosis-section" id="diagnostico" data-surface="panel">
          <div className="section-head reveal">
            <span className="section-kicker">Diagnóstico rápido · 30 segundos</span>
            <h2>Marque os sinais que acontecem hoje na sua operação.</h2>
            <p>Toque em cada situação que você reconhece. No final, você vê o nível de risco da sua precificação e o próximo passo para corrigir.</p>
          </div>

          <div className="diagnosis-grid">
            <div className="diagnosis-list">
              {diagnostics.map((item, index) => {
                const active = checked.has(index)
                return (
                  <button
                    className="diagnosis-option reveal"
                    key={item.title}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDiagnostic(index)}
                  >
                    <span className="option-icon"><Icon name={item.icon} /></span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.cue}</small>
                    </span>
                    <i><Icon name="check" /></i>
                  </button>
                )
              })}
            </div>

            <aside className="diagnosis-result reveal" aria-live="polite">
              <HologramScore score={checked.size} max={4} />
              <h3>{diagnosisLevel}</h3>
              <p>{diagnosisCopy}</p>
              <a className="btn btn-primary" href="#inscricao" onClick={openSignup}>
                Receber próximo passo <Icon name="arrow" />
              </a>
            </aside>
          </div>
        </section>

        <section className="simulator-section" id="simulador" data-surface="base">
          <Wave />
          <div className="section-head align-left reveal">
            <span className="section-kicker">Linguagem de margem</span>
            <h2>Preço deixa de ser opinião quando a conta aparece.</h2>
            <p>Este bloco mostra a direção: o curso aprofunda critério, margem e comunicação para a realidade médica.</p>
          </div>

          <div className="simulator-grid">
            <div className="simulator-controls reveal">
              <label>
                <span>Valor da consulta</span>
                <strong>{currency.format(price)}</strong>
                <input type="range" min="200" max="1200" step="25" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
              </label>
              <label>
                <span>Consultas por semana</span>
                <strong>{appointments}</strong>
                <input type="range" min="6" max="60" step="1" value={appointments} onChange={(event) => setAppointments(Number(event.target.value))} />
              </label>
              <label>
                <span>Custo estimado por consulta</span>
                <strong>{currency.format(cost)}</strong>
                <input type="range" min="40" max="700" step="10" value={cost} onChange={(event) => setCost(Number(event.target.value))} />
              </label>
            </div>

            <div className="margin-panel reveal">
              <HologramScore score={margin} max={100} positiveHigh showReadout={false} />
              <div className="margin-copy">
                <span>Margem estimada</span>
                <strong>{margin}%</strong>
                <p>
                  Receita mensal: {currency.format(gross)}<br />
                  Sobra antes de outros ajustes: {currency.format(net)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="method-section" id="metodo" data-surface="panel">
          <Wave />
          <div className="section-head reveal">
            <span className="section-kicker">Método X5 Med</span>
            <h2>Uma trilha visual para sair do improviso.</h2>
          </div>

          <div className="method-track">
            {methodSteps.map(([number, title, text, icon], index) => (
              <article
                className="method-step"
                key={title}
                style={{ "--r": `${[-15, -5, 5, 15][index] ?? 0}deg` }}
              >
                <span className="icon-badge"><Icon name={icon} /></span>
                <span className="method-num">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="transformation-section" data-surface="base">
          <Wave />
          <div className="section-head align-left reveal">
            <span className="section-kicker">Antes e depois</span>
            <h2>A mudança esperada é na forma de decidir.</h2>
          </div>
          <div className="transformation-grid">
            {transformations.map(([beforeLabel, before, afterLabel, after]) => (
              <article className="transform-card reveal" key={before}>
                <span>{beforeLabel}</span>
                <p>{before}</p>
                <Icon name="arrow" />
                <span>{afterLabel}</span>
                <strong>{after}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="professor-section" id="professor" data-surface="panel">
          <WhiteDivider />
          <div className="professor-media reveal">
            <Image src="/assets/fabio.png" alt="Dr. Fábio Rodrigues" fill quality={88} sizes="(max-width: 900px) 100vw, 44vw" />
            <RotatingSeal />
          </div>
          <div className="professor-copy reveal">
            <span className="section-kicker">Professor</span>
            <h2>Dr. Fábio Rodrigues</h2>
            <p>
              A proposta parte da realidade de médicos que precisam precificar sem transformar a relação com o paciente
              em uma negociação desconfortável.
            </p>
            <div className="proof-grid">
              {proofPoints.map(([title, text]) => (
                <article key={title}>
                  <span className="icon-badge icon-badge--gold"><Icon name="shield" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonial-section" id="depoimentos" data-surface="base">
          <Wave />
          <div className="section-head reveal">
            <span className="section-kicker">Quem já participou</span>
            <h2>Médicos que trocaram o achismo por critério.</h2>
            <p>Depoimentos de participantes da trilha. Resultados dependem da realidade de cada operação.</p>
          </div>
          <div className="testimonial-carousel reveal" aria-label="Depoimentos em destaque">
            <div className="testimonial-track">
              {[...testimonials, ...testimonials].map(([quote, author, role], index) => (
                <figure
                  className="testimonial-card"
                  key={`${author}-${index}-${quote}`}
                  tabIndex={index < testimonials.length ? 0 : -1}
                  aria-hidden={index >= testimonials.length}
                >
                  <span className="icon-badge icon-badge--gold"><Icon name="quote" /></span>
                  <blockquote>{quote}</blockquote>
                  <figcaption>
                    <strong>{author}</strong>
                    <span>{role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="outcome-section" data-surface="panel">
          <Wave />
          <div className="section-head reveal">
            <span className="section-kicker">Entrega</span>
            <h2>O que você leva ao final da trilha.</h2>
          </div>
          <div className="outcome-grid">
            {outcomes.map((item) => (
              <div className="outcome-item reveal" key={item}>
                <Icon name="check" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="logistics-section" data-surface="base">
          <Wave />
          <div className="section-head reveal">
            <span className="section-kicker">Como funciona</span>
            <h2>Formato pensado para a rotina de quem atende.</h2>
          </div>
          <div className="logistics-grid">
            {logistics.map(([icon, title, text]) => (
              <article className="logistics-item reveal" key={title}>
                <span className="logistics-icon"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="signup-section" id="inscricao" data-surface="panel">
          <WhiteDivider />
          <div className="signup-copy reveal">
            <span className="section-kicker">Inscrição</span>
            <h2>Garanta sua vaga na próxima turma.</h2>
            <p>
              Envie seus dados para receber o próximo passo no WhatsApp. Sem promessa de faturamento, sem venda
              agressiva, com foco em decisão de preço.
            </p>
            <div className="offer-card">
              <span className="offer-badge"><Icon name="spark" /> Oferta da turma</span>
              <ul className="offer-list">
                {offerIncludes.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="offer-price">
                <span className="offer-from">de {OFFER.fromPrice} por</span>
                <strong><CountUp to={OFFER.priceValue} prefix="R$ " suffix=",00" /></strong>
                <span className="offer-installment">{OFFER.installment}</span>
              </div>
              <a className="btn btn-primary" href="#inscricao" onClick={openSignup}>
                Quero participar <Icon name="arrow" />
              </a>
              <p className="offer-note"><Icon name="shield" /> Vagas limitadas · inscrição segura, sem promessa de faturamento</p>
            </div>
          </div>
        </section>

        <section className="faq-section" id="faq" data-surface="base">
          <Wave />
          <div className="section-head reveal">
            <span className="section-kicker">FAQ</span>
            <h2>Perguntas importantes antes de entrar.</h2>
          </div>
          <div className="faq-list">
            {faq.map(([question, answer]) => (
              <details className="reveal" key={question}>
                <summary>
                  <span>{question}</span>
                  <i className="faq-chevron"><Icon name="chevron" /></i>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      {signupOpen ? (
        <div className="signup-modal" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
          <button className="signup-modal-backdrop" type="button" aria-label="Fechar formulário" onClick={() => setSignupOpen(false)} />
          <div className="signup-modal-panel">
            <button className="signup-modal-close" type="button" aria-label="Fechar formulário" onClick={() => setSignupOpen(false)}>
              <Icon name="close" />
            </button>

            {submitted ? (
              <div className="signup-form signup-success" role="status" aria-live="polite">
                <span className="success-mark"><Icon name="check" /></span>
                <h3 id="signup-modal-title">Quase lá!</h3>
                <p>
                  Abrimos o WhatsApp com sua mensagem pronta. Se a janela não abriu, toque no botão abaixo para falar com a
                  equipe da X5 Med.
                </p>
                <a
                  className="btn btn-primary"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero participar da Trilha de Precificação Médica X5 Med.")}`}
                  target="_blank"
                  rel="noopener"
                >
                  Abrir WhatsApp <Icon name="arrow" />
                </a>
                <button className="btn btn-secondary" type="button" onClick={() => setSubmitted(false)}>
                  Enviar outro contato
                </button>
              </div>
            ) : (
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-step">1 de 1 · Dados de contato</div>
                <h3 id="signup-modal-title" className="signup-modal-title">Liberar inscrição</h3>
                <label>
                  Nome
                  <input name="name" type="text" autoComplete="name" required placeholder="Seu nome" />
                </label>
                <label>
                  WhatsApp
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="(00) 00000-0000" />
                </label>
                <label>
                  E-mail
                  <input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
                </label>
                {formError ? <p className="form-error" role="alert">{formError}</p> : null}
                <button className="btn btn-primary" type="submit" disabled={pending} aria-busy={pending}>
                  {pending ? "Enviando..." : <>Liberar inscrição <Icon name="arrow" /></>}
                </button>
                <p className="form-note">A equipe chama você com as informações da turma. Dados usados apenas para contato da X5 Med.</p>
              </form>
            )}
          </div>
        </div>
      ) : null}

      <footer className="site-footer" data-surface="base">
        <Wave />
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" width="92" height="42" />
            <p>Precificação médica com método, margem e comunicação de valor — sem promessa de faturamento.</p>
          </div>
          <div className="footer-cta">
            <p>Ainda em dúvida se faz sentido para a sua fase atual?</p>
            <a
              className="btn btn-secondary"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre a Trilha de Precificação Médica X5 Med.")}`}
              target="_blank"
              rel="noopener"
            >
              <Icon name="phone" /> Falar com o time
            </a>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} X5 Med. Todos os direitos reservados.</span>
          <span>Conteúdo alinhado à comunicação ética na área médica.</span>
        </div>
      </footer>

      <a className="mobile-sticky-cta" href="#inscricao" onClick={openSignup}>
        <Icon name="phone" />
        Quero participar
        <Icon name="arrow" />
      </a>
    </div>
  )
}
