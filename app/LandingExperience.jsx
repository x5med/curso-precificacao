"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      className={direction === "left" ? "icon-left" : undefined}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="m4 9.4 3.1 3.1L14 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M9 1.4l2.1 4.27 4.71.68-3.41 3.32.8 4.69L9 12.14l-4.2 2.22.8-4.69L2.19 6.35l4.71-.68z" />
    </svg>
  )
}

function scrollRail(ref, direction) {
  const rail = ref.current
  if (!rail) return
  const card = rail.querySelector("article")
  const gap = Number.parseFloat(getComputedStyle(rail).columnGap || "20") || 20
  const distance = card ? card.offsetWidth + gap : rail.clientWidth * 0.85
  rail.scrollBy({ left: direction * distance, behavior: "smooth" })
}

const painCards = [
  ["01", "Preço no achismo", "Você para de usar medo, comparação ou tentativa como régua principal."],
  ["02", "Margem invisível", "Custos, lucro e sustentabilidade entram na decisão de forma objetiva."],
  ["03", "Reajuste travado", "Você cria critério para revisar honorários sem transformar isso em tensão."],
  ["04", "Valor pouco percebido", "A comunicação sustenta melhor a experiência que o paciente recebe."],
  ["05", "Agenda cheia, lucro fraco", "Volume deixa de mascarar uma operação que trabalha demais para sobrar pouco."],
]

const methodSteps = [
  ["Diagnosticar", "Custos reais, rotina, agenda e estrutura entram primeiro na conta."],
  ["Precificar", "O valor passa a considerar margem, posicionamento e percepção de entrega."],
  ["Comunicar", "Você aprende a defender valor sem parecer vendedor e sem pressionar paciente."],
  ["Reajustar", "A revisão de honorários ganha método, timing e argumento claro."],
]

const modules = [
  ["Módulo 1", "Diagnóstico de preço", "Mapeie onde sua consulta perde margem antes mesmo de chegar ao paciente."],
  ["Módulo 2", "Margem médica", "Entenda faturamento, lucro, custo operacional e sustentabilidade da agenda."],
  ["Módulo 3", "Reajuste com critério", "Defina quando, quanto e como revisar preço com menos insegurança."],
  ["Módulo 4", "Valor percebido", "Ajuste discurso, experiência e posicionamento para reduzir comparação por preço."],
]

const outcomes = [
  "Mais clareza para definir honorários",
  "Menos comparação com o preço do colega",
  "Mais segurança em conversas sobre valor",
  "Leitura melhor de margem e sustentabilidade",
  "Reajustes com lógica, não impulso",
  "Posicionamento mais coerente com a entrega",
]

const proof = [
  ["Recorte médico", "Consulta, honorários, margem e medicina particular. Nada de curso genérico de vendas."],
  ["Comunicação ética", "Clareza empresarial sem promessa de faturamento e sem pressão comercial."],
  ["Aplicação prática", "Critérios para revisar preço, não só conceitos soltos."],
]

const testimonials = [
  {
    quote: "Parei de cobrar olhando o preço do vizinho. Hoje sei exatamente a margem de cada consulta antes de definir o valor.",
    name: "Dra. Camila Andrade",
    role: "Dermatologista · São Paulo",
    initials: "CA",
  },
  {
    quote: "Reajustei meus honorários sem perder pacientes. O método me deu argumento e segurança para conduzir a conversa.",
    name: "Dr. Rafael Menezes",
    role: "Ortopedista · Belo Horizonte",
    initials: "RM",
  },
  {
    quote: "Eu tinha agenda lotada e lucro fraco. Finalmente entendi onde estava perdendo dinheiro dentro da própria operação.",
    name: "Dra. Juliana Prado",
    role: "Ginecologista · Curitiba",
    initials: "JP",
  },
  {
    quote: "A parte de valor percebido mudou minhas conversas com pacientes. Defendo o preço sem nunca parecer vendedor.",
    name: "Dr. Bruno Carvalho",
    role: "Cardiologista · Recife",
    initials: "BC",
  },
  {
    quote: "Estruturei meu consultório particular do zero com critério de preço. Saí do achismo e passei a decidir com dados.",
    name: "Dra. Letícia Souza",
    role: "Pediatra · Porto Alegre",
    initials: "LS",
  },
  {
    quote: "Conteúdo direto e com recorte médico de verdade. Nada de curso genérico de vendas, é aplicação prática na consulta.",
    name: "Dr. André Tavares",
    role: "Otorrinolaringologista · Salvador",
    initials: "AT",
  },
]

const faq = [
  ["Serve para quem ainda não tem clínica grande?", "Sim. O método também ajuda consultórios individuais e médicos que estão estruturando atendimento particular."],
  ["Preciso aumentar preço imediatamente?", "Não. A proposta é criar critério antes da decisão. Reajuste só faz sentido quando custo, margem e valor percebido estão claros."],
  ["Isso é treinamento de venda?", "Não. A página e o curso tratam de precificação, posicionamento e comunicação de valor com responsabilidade."],
  ["O curso promete faturamento?", "Não. A promessa é método para decidir melhor preço, margem e comunicação. Resultado financeiro depende da realidade de cada operação."],
]

export default function LandingExperience() {
  const painRailRef = useRef(null)
  const videoRef = useRef(null)
  const [videoActive, setVideoActive] = useState(false)
  const [formStatus, setFormStatus] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)
  const [reviewPaused, setReviewPaused] = useState(false)

  useEffect(() => {
    if (reviewPaused) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return
    const timer = setInterval(() => {
      setActiveReview((current) => (current + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [reviewPaused])

  function goToReview(index) {
    setActiveReview((index + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [menuOpen])

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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  function playHeroVideo() {
    const video = videoRef.current
    if (!video) return
    setVideoActive(true)
    video.play().catch(() => setVideoActive(false))
  }

  function stopHeroVideo() {
    const video = videoRef.current
    setVideoActive(false)
    if (video) video.pause()
  }

  function toggleHeroVideo() {
    if (videoActive) {
      stopHeroVideo()
    } else {
      playHeroVideo()
    }
  }

  function handleHeroPointerEnter(event) {
    if (event.pointerType === "touch") return
    playHeroVideo()
  }

  function handleHeroPointerLeave(event) {
    if (event.pointerType === "touch") return
    stopHeroVideo()
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFormStatus("Inscrição liberada. Nossa equipe vai chamar você no WhatsApp informado.")
  }

  return (
    <div className="landing-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="X5 Med">
          <Image src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" width={92} height={42} priority />
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#dor">Dor</a>
          <a href="#metodo">Método</a>
          <a href="#entrega">Entrega</a>
          <a href="#professor">Professor</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="topbar-cta" href="#inscricao">Liberar inscrição</a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
        </button>
      </header>

      <nav
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Navegação"
        aria-hidden={!menuOpen}
      >
        <a href="#dor" onClick={() => setMenuOpen(false)}>Dor</a>
        <a href="#metodo" onClick={() => setMenuOpen(false)}>Método</a>
        <a href="#entrega" onClick={() => setMenuOpen(false)}>Entrega</a>
        <a href="#professor" onClick={() => setMenuOpen(false)}>Professor</a>
        <a href="#depoimentos" onClick={() => setMenuOpen(false)}>Depoimentos</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <a className="btn btn-primary" href="#inscricao" onClick={() => setMenuOpen(false)}>
          Liberar inscrição <ArrowIcon />
        </a>
      </nav>

      <main id="top" className="sales-page">
        <section className="hero-section page-panel">
          <div
            className={`media-stage hero-backdrop ${videoActive ? "is-playing" : ""}`}
            onPointerEnter={handleHeroPointerEnter}
            onPointerLeave={handleHeroPointerLeave}
            onClick={toggleHeroVideo}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") toggleHeroVideo()
            }}
            aria-label={videoActive ? "Pausar vídeo de apresentação" : "Reproduzir vídeo de apresentação"}
          >
            <video
              ref={videoRef}
              className="hero-video"
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/dr-fabio-poster.jpg"
            >
              <source src="/assets/dr-fabio.webm" type="video/webm" />
              <source src="/assets/dr-fabio.mp4" type="video/mp4" />
            </video>
            <Image
              className="hero-still"
              src="/assets/hero-x5med.png"
              alt="Dr. Fábio em escritório premium com gráficos de crescimento"
              fill
              priority
              quality={92}
              sizes="100vw"
            />
          </div>

          <div className="hero-content reveal">
            <span className="scribble scribble-growth hero-scribble" aria-hidden="true" />
            <span className="section-kicker">Curso de Precificação Médica</span>
            <h1>
              Precifique sua consulta <strong>com método.</strong>
            </h1>
            <p className="hero-lead">
              Pare de cobrar por comparação e transforme custo, margem e posicionamento em uma decisão clara.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#inscricao">
                Quero participar <ArrowIcon />
              </a>
              <a className="btn btn-secondary" href="#metodo">Ver método</a>
            </div>
            <div className="hero-badges" aria-label="Pilares da precificação médica">
              {["Custo real", "Margem", "Valor percebido"].map((item) => (
                <span key={item}>
                  <CheckIcon />
                  {item}
                </span>
              ))}
            </div>
            <p className="hero-slot">Turma online. Aplicação prática para medicina particular.</p>
          </div>
        </section>

        <section
          className="reviews-section page-panel"
          id="depoimentos"
          onMouseEnter={() => setReviewPaused(true)}
          onMouseLeave={() => setReviewPaused(false)}
          onFocusCapture={() => setReviewPaused(true)}
          onBlurCapture={() => setReviewPaused(false)}
        >
          <div className="reviews-viewport reveal" aria-live="polite">
            <div
              className="reviews-track"
              style={{ transform: `translateX(-${activeReview * 100}%)` }}
            >
              {testimonials.map((item, index) => (
                <figure className="review-slide" key={item.name} aria-hidden={index !== activeReview}>
                  <div className="review-stars" aria-label="Avaliação 5 de 5 estrelas">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <StarIcon key={star} />
                    ))}
                  </div>
                  <blockquote className="review-quote">{item.quote}</blockquote>
                  <figcaption className="review-author">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="review-dots reveal" role="tablist" aria-label="Selecionar depoimento">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                className={`review-dot${index === activeReview ? " is-active" : ""}`}
                aria-selected={index === activeReview}
                aria-label={`Ver depoimento de ${item.name}`}
                onClick={() => goToReview(index)}
              />
            ))}
          </div>
        </section>

        <section className="story-section page-panel" id="dor">
          <div className="phone-mock reveal" aria-hidden="true">
            <span className="phone-glow" />
            <Image
              className="phone-image"
              src="/assets/phone-mockup.png"
              alt=""
              width={1024}
              height={1536}
              quality={92}
              sizes="(max-width: 1040px) 60vw, 320px"
            />
          </div>
          <div className="story-copy reveal">
            <span className="section-kicker">O problema real</span>
            <h2>Agenda cheia não prova que sua clínica está saudável.</h2>
            <p>
              Atender mais pode esconder margem fraca. A proposta é parar de comparar preço e começar a ler a operação
              com critério.
            </p>
          </div>
        </section>

        <section className="pain-strip page-panel">
          <div className="section-head reveal">
            <span className="section-kicker">Sinais de alerta</span>
            <h2>Onde a precificação costuma quebrar.</h2>
          </div>
          <div className="rail-controls reveal">
            <button className="icon-btn" type="button" onClick={() => scrollRail(painRailRef, -1)} aria-label="Card anterior">
              <ArrowIcon direction="left" />
            </button>
            <button className="icon-btn" type="button" onClick={() => scrollRail(painRailRef, 1)} aria-label="Próximo card">
              <ArrowIcon />
            </button>
          </div>
          <div className="card-rail" ref={painRailRef}>
            {painCards.map(([number, title, text]) => (
              <article className="pain-card reveal" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="path-section page-panel" id="metodo">
          <div className="section-head reveal">
            <span className="section-kicker">O que você recebe</span>
            <h2>Uma trilha direta para sair do improviso.</h2>
          </div>
          <div className="path-cards">
            {modules.map(([label, title, text], index) => (
              <article className="path-card reveal" key={title}>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <i>{String(index + 1).padStart(2, "0")}</i>
              </article>
            ))}
          </div>
          <div className="path-cta-wrap reveal">
            <a className="btn btn-primary path-cta" href="#inscricao">
              Quero participar <ArrowIcon />
            </a>
            <span className="scribble scribble-loop path-scribble" aria-hidden="true" />
          </div>
        </section>

        <section className="professor-section page-panel" id="professor">
          <div className="professor-copy reveal">
            <span className="section-kicker">Professor</span>
            <h2>Dr. Fábio Rodrigues</h2>
            <p>
              A aula parte da realidade de médicos que precisam tomar decisões de preço sem transformar a relação com o
              paciente em uma negociação desconfortável.
            </p>
            <div className="proof-grid">
              {proof.map(([title, text]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="professor-visual reveal" aria-hidden="true">
            <Image
              src="/assets/dr-fabio-poster.jpg"
              alt=""
              fill
              quality={88}
              sizes="(max-width: 1040px) 100vw, 50vw"
            />
          </div>
        </section>

        <section className="outcome-section page-panel" id="entrega">
          <div className="section-head align-left reveal">
            <span className="section-kicker">Resultado esperado</span>
            <h2>Um passo para mudar sua forma de decidir preço.</h2>
            <p>Clareza antes de cobrar, reajustar ou explicar o valor da sua consulta.</p>
          </div>
          <div className="outcome-list">
            {outcomes.map((item) => (
              <div className="outcome-item reveal" key={item}>
                <CheckIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="signup-section page-panel" id="inscricao">
          <div className="signup-copy reveal">
            <span className="section-kicker">Aplicação</span>
            <h2>Libere o próximo passo.</h2>
            <p>Preencha seus dados para receber o acesso à etapa de inscrição do curso de Precificação Médica.</p>
          </div>
          <form className="signup-form reveal" onSubmit={handleSubmit}>
            <label>
              Nome
              <input name="name" type="text" autoComplete="name" required placeholder="Seu nome" />
            </label>
            <label>
              WhatsApp
              <input name="phone" type="tel" autoComplete="tel" required placeholder="(00) 00000-0000" />
            </label>
            <label>
              E-mail
              <input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" />
            </label>
            <button className="btn btn-primary" type="submit">
              Liberar inscrição <ArrowIcon />
            </button>
            {formStatus ? <p className="form-status">{formStatus}</p> : null}
          </form>
        </section>

        <section className="faq-section page-panel" id="faq">
          <div className="section-head reveal">
            <span className="section-kicker">FAQ</span>
            <h2>Perguntas importantes antes de entrar.</h2>
          </div>
          <div className="faq-list">
            {faq.map(([question, answer]) => (
              <details className="reveal" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
