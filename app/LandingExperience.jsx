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

  function resetVideo() {
    const video = videoRef.current
    if (!video) return
    video.pause()
    try {
      video.currentTime = 0
    } catch {}
  }

  function playHeroVideo() {
    const video = videoRef.current
    if (!video) return
    resetVideo()
    setVideoActive(true)
    video.play().catch(() => setVideoActive(false))
  }

  function stopHeroVideo() {
    const video = videoRef.current
    setVideoActive(false)
    resetVideo()
    if (video) video.load()
  }

  function toggleHeroVideo() {
    if (videoActive) {
      stopHeroVideo()
    } else {
      playHeroVideo()
    }
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
          <a href="#faq">FAQ</a>
        </nav>
        <a className="topbar-cta" href="#inscricao">Liberar inscrição</a>
      </header>

      <main id="top" className="sales-page">
        <section className="hero-section page-panel">
          <div
            className={`media-stage hero-backdrop ${videoActive ? "is-playing" : ""}`}
            onPointerEnter={playHeroVideo}
            onPointerLeave={stopHeroVideo}
            onClick={toggleHeroVideo}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") toggleHeroVideo()
            }}
            aria-label="Reproduzir vídeo da hero"
          >
            <video ref={videoRef} className="hero-video" muted playsInline preload="none">
              <source src="/assets/dr-fabio.webm" type="video/webm" />
              <source src="/assets/dr-fabio.mp4" type="video/mp4" />
            </video>
            <Image
              className="hero-still"
              src="/assets/hero-x5med.png"
              alt="Dr. Fábio em escritório premium com gráficos de crescimento"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 980px"
            />
          </div>

          <div className="hero-content reveal">
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

        <section className="story-section page-panel" id="dor">
          <div className="phone-mock reveal" aria-hidden="true">
            <div className="phone-screen">
              {painCards.slice(0, 4).map(([number, title]) => (
                <span key={title}>
                  <small>{number}</small>
                  {title}
                </span>
              ))}
            </div>
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
          <div className="path-line" aria-hidden="true" />
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
          <a className="btn btn-primary path-cta reveal" href="#inscricao">
            Quero participar <ArrowIcon />
          </a>
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
            <Image src="/assets/hero-x5med.png" alt="" fill sizes="(max-width: 760px) 100vw, 520px" />
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
