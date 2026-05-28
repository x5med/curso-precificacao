import Script from "next/script"

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const salesProblems = [
  ["01", "Preço no achismo", "Você deixa de escolher honorários por medo, comparação ou tentativa."],
  ["02", "Margem invisível", "Custos, lucro e sustentabilidade entram na conversa de forma objetiva."],
  ["03", "Reajuste com receio", "Você aprende critérios para avaliar quando e como revisar valores."],
  ["04", "Valor pouco percebido", "Sua comunicação passa a sustentar melhor a experiência que você entrega."],
]

const signals = [
  ["01", "Você atende mais para compensar preço baixo.", "Mais horários podem manter o faturamento, mas também aumentam desgaste quando a margem não acompanha."],
  ["02", "O preço do colega vira referência principal.", "O problema é que você não conhece os custos, a estrutura e a estratégia por trás da operação dele."],
  ["03", "Cada reajuste vira desconforto.", "Sem método, aumentar honorários parece risco pessoal, não decisão empresarial."],
  ["04", "Valor baixo não resolve percepção baixa.", "Quando sua entrega não é percebida, o paciente tende a comparar pelo menor preço."],
]

const methodItems = [
  ["1", "Custos que passam despercebidos", "Identifique o que precisa entrar na conta antes de definir ou revisar o valor da consulta."],
  ["2", "Faturamento, lucro e margem", "Entenda a diferença entre volume de atendimento e sustentabilidade financeira."],
  ["3", "Reajuste com critério", "Avalie quando revisar honorários sem depender de culpa, medo ou comparação."],
  ["4", "Comunicação de valor", "Aprenda a sustentar o valor percebido sem parecer vendedor ou pressionar pacientes."],
  ["5", "Posicionamento e preço", "Alinhe honorários, experiência, autoridade e percepção da clínica."],
  ["6", "Guerra de preço", "Reduza a dependência de disputar pelo menor valor e aumente clareza sobre sua entrega."],
]

const outcomes = [
  "Preço com fundamento",
  "Reajuste com critério",
  "Margem mais visível",
  "Menos comparação",
  "Comunicação mais segura",
  "Decisões menos emocionais",
]

const includedItems = [
  ["Módulo 1", "Diagnóstico de preço", "Mapeie custos, estrutura, agenda e pontos que deixam sua consulta financeiramente frágil."],
  ["Módulo 2", "Margem e sustentabilidade", "Entenda a diferença entre faturar mais, lucrar melhor e proteger a operação médica."],
  ["Módulo 3", "Reajuste com critério", "Defina quando, quanto e como revisar honorários sem depender de insegurança ou comparação."],
  ["Módulo 4", "Comunicação de valor", "Construa uma explicação mais segura para sustentar preço sem pressão comercial."],
  ["Material de apoio", "Checklist de precificação", "Use um roteiro prático para revisar preço, margem e posicionamento da sua consulta."],
  ["Aplicação", "Decisão guiada", "Saia com critérios para tomar decisões de preço de acordo com a realidade da sua clínica."],
]

const proofItems = [
  ["01", "Método específico para médicos", "A página deixa claro que não é uma formação genérica de vendas. O recorte é consulta, honorários, margem e medicina particular."],
  ["02", "Autoridade com responsabilidade", "A comunicação evita promessas de faturamento rápido e posiciona o curso como decisão empresarial aplicada à prática médica."],
  ["03", "Próximo passo proporcional", "O lead informa apenas nome, WhatsApp e e-mail antes de acessar a etapa de inscrição. As perguntas extras ficam opcionais."],
]

const objections = [
  ["Não tenho clínica grande.", "O curso serve também para consultório individual ou médicos iniciando atendimento particular."],
  ["Tenho medo de reajustar.", "A proposta é criar critério antes da conversa, reduzindo improviso e desconforto."],
  ["Não quero parecer vendedor.", "O foco é comunicação de valor com ética, clareza e respeito à relação médico-paciente."],
  ["Não conheço meus custos.", "O método começa justamente pela leitura de custo real, margem e sustentabilidade."],
]

export default function Home() {
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || "#formulario"
  const checkoutLinkProps = checkoutUrl.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {}

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="page-backdrop" aria-hidden="true" />

      <div className="top-strip">
        <span>Precificação Médica</span>
        <strong>Preço com método, margem e comunicação de valor.</strong>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="X5 Med">
          <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" className="brand-logo" />
        </a>
        <nav className="nav" aria-label="Navegação principal">
          <a href="#dor">Dor</a>
          <a href="#metodo">Método</a>
          <a href="#entregaveis">Entrega</a>
          <a href="#professor">Professor</a>
          <a href="#formulario">Inscrição</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#formulario">
          Liberar inscrição
        </a>
      </header>

      <main id="top">
        <section className="hero section-dark spotlight-zone">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy reveal-block">
            <p className="eyebrow">Curso de Precificação Médica</p>
            <h1>
              Pare de definir o valor da sua consulta <span>no escuro.</span>
            </h1>
            <p className="hero-lead">
              Aprenda a transformar custo, margem e posicionamento em uma decisão de preço mais clara.
            </p>
            <p className="hero-context">
              Uma formação para médicos que querem parar de cobrar por insegurança, comparação ou improviso,
              sem promessa de faturamento e sem venda agressiva.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#formulario">
                Liberar minha inscrição
                <ArrowIcon />
              </a>
              <a className="button button-secondary" href="#metodo">
                Ver o método
              </a>
            </div>
            <div className="quick-facts" aria-label="Focos do curso">
              <span>Custos e margem</span>
              <span>Reajuste com critério</span>
              <span>Valor percebido</span>
            </div>
            <div className="hero-trust" aria-label="Compromissos do curso">
              <span>Sem promessa de faturamento</span>
              <span>Sem venda agressiva</span>
              <span>Aplicado a medicina particular</span>
            </div>
          </div>

          <div className="hero-visual reveal-block" aria-label="Visual do curso de Precificação Médica">
            <div className="hero-frame interactive-video-frame">
              <video
                className="hero-video"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/dr-fabio-poster.jpg"
                aria-label="Dr. Fábio em ambiente premium apresentando a X5 Med"
              >
                <source src="/assets/dr-fabio.mp4" type="video/mp4" />
              </video>
              <div className="frame-scan" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="sales-strip" aria-label="Principais problemas que o curso organiza">
          {salesProblems.map(([number, title, text], index) => (
            <article className="sales-card reveal-block" key={title}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <div className="method-mini" aria-hidden="true">
                <i style={{ "--level": `${32 + index * 8}%` }} />
                <i style={{ "--level": `${52 + index * 6}%` }} />
                <i style={{ "--level": `${74 + index * 3}%` }} />
              </div>
            </article>
          ))}
        </section>

        <section className="stats-band" aria-label="Resumo do curso">
          <div className="stats-inner growth-animate reveal-block">
            <div className="stat-item">
              <strong className="stat-text">Online</strong>
              <span>acesso flexível</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <strong>
                <span data-count="3">0</span>
              </strong>
              <span>pilares centrais</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <strong className="stat-text">X5</strong>
              <span>metodologia aplicada</span>
            </div>
            <div className="stat-divider" aria-hidden="true" />
            <div className="stat-item">
              <strong>
                <span data-count="100">0</span>
                <small>%</small>
              </strong>
              <span>medicina particular</span>
            </div>
          </div>
        </section>

        <section id="dor" className="diagnosis section-light">
          <div className="section-heading reveal-block">
            <p className="eyebrow">Dor central</p>
            <h2>Agenda cheia pode esconder uma margem fraca.</h2>
            <p>
              Muitos médicos trabalham muito, atendem bem e ainda sentem que a clínica não cresce com a saúde
              financeira que deveria.
            </p>
          </div>
          <div className="signal-grid">
            {signals.map(([number, title, text]) => (
              <article className="signal-card tilt-card reveal-block" key={title}>
                <span className="signal-index">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="belief section-dark spotlight-zone">
          <div className="belief-inner reveal-block">
            <p className="eyebrow">Quebra de crença</p>
            <h2>Preço não é apenas número. É estratégia de clínica.</h2>
            <p>
              O valor da consulta comunica posicionamento, segurança, experiência e percepção de cuidado. Quando
              essas peças não conversam, o preço parece frágil.
            </p>
            <div className="formula" aria-label="Pilares da precificação médica">
              <span>Custo real</span>
              <span>Margem</span>
              <span>Posicionamento</span>
              <span>Valor percebido</span>
            </div>
          </div>
        </section>

        <section id="metodo" className="solution section-light">
          <div className="split solution-split">
            <div className="reveal-block">
              <p className="eyebrow">A solução</p>
              <h2>Uma formação prática para médicos que querem cobrar com mais clareza.</h2>
            </div>
            <div className="solution-card reveal-block">
              <p>
                O curso ensina você a analisar o preço da consulta e dos serviços médicos com uma lógica mais
                empresarial, sem perder a responsabilidade ética da medicina.
              </p>
              <div className="principles">
                <span>Critérios para definir preço</span>
                <span>Leitura de margem e sustentabilidade</span>
                <span>Comunicação de valor sem pressão</span>
              </div>
            </div>
          </div>
        </section>

        <section id="conteudo" className="method section-dark spotlight-zone">
          <div className="section-heading reveal-block">
            <p className="eyebrow">O que você aprende</p>
            <h2>Da insegurança no preço para uma decisão com método.</h2>
            <p>
              O objetivo não é entregar uma tabela pronta. É ensinar critérios para você decidir de acordo com a
              realidade da sua prática médica.
            </p>
          </div>
          <div className="method-grid pricing-grid">
            {methodItems.map(([number, title, text]) => (
              <article className="method-card tilt-card reveal-block" key={title}>
                <span className="method-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="entregaveis" className="deliverables section-light">
          <div className="section-heading reveal-block">
            <p className="eyebrow">O que você recebe</p>
            <h2>Um roteiro prático para sair da dúvida e revisar sua precificação.</h2>
            <p>
              Módulos, materiais e aplicações práticas para transformar preço em uma decisão mais clara, sem depender
              de uma tabela universal.
            </p>
          </div>
          <div className="bonus-grid deliverables-grid">
            {includedItems.map(([label, title, text]) => (
              <article className="bonus-card deliverable-card reveal-block" key={title}>
                <span className="bonus-icon">{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="journey section-dark spotlight-zone">
          <div className="section-heading compact reveal-block">
            <p className="eyebrow">Mecanismo</p>
            <h2>Quem não comunica valor acaba discutindo preço.</h2>
            <p>O curso conecta os pontos que tornam a precificação mais madura na medicina particular.</p>
          </div>
          <div className="journey-line pricing-line reveal-block">
            <span>Cálculo financeiro</span>
            <span>Margem protegida</span>
            <span>Posicionamento</span>
            <span>Experiência</span>
            <span>Comunicação</span>
            <span>Decisão</span>
          </div>
          <p className="journey-note reveal-block">
            Precificação médica começa nos números, mas não termina neles. Ela precisa aparecer na forma como o
            paciente percebe sua clínica.
          </p>
        </section>

        <section id="para-quem" className="audience section-dark spotlight-zone">
          <div className="split">
            <div className="reveal-block">
              <p className="eyebrow">Para quem é</p>
              <h2>Para médicos que querem parar de cobrar por tentativa.</h2>
              <p>
                Indicado para médicos que atendem ou desejam atender pacientes particulares e querem organizar melhor
                sua lógica de honorários.
              </p>
            </div>
            <ul className="check-list reveal-block">
              <li>Você sente insegurança para definir ou reajustar o valor da consulta.</li>
              <li>Usa o preço de colegas como referência principal.</li>
              <li>Trabalha muito, mas sente que sobra pouco.</li>
              <li>Não sabe calcular com clareza seus custos.</li>
              <li>Quer proteger melhor sua margem.</li>
              <li>Tem dificuldade de comunicar valor sem parecer vendedor.</li>
            </ul>
          </div>
          <div className="not-for reveal-block">
            <strong>Não é para quem procura promessa de faturamento rápido.</strong>
            <span>Também não é para quem busca fórmula mágica, venda agressiva ou uma tabela universal de preço.</span>
          </div>
        </section>

        <section className="transformation section-light">
          <div className="transformation-panel reveal-block">
            <p className="eyebrow">Transformação esperada</p>
            <h2>Depois do curso, sua pergunta deixa de ser "quanto o mercado cobra?".</h2>
            <p>
              Você passa a analisar quanto sua operação exige, qual margem precisa preservar, como seu posicionamento
              sustenta esse valor e como comunicar isso com clareza.
            </p>
            <div className="before-after-grid" aria-label="Comparacao visual da transformacao">
              <div>
                <span>Antes</span>
                <strong>Preço pelo medo</strong>
                <p>Colega como referência, reajuste desconfortável e margem invisível.</p>
              </div>
              <div>
                <span>Depois</span>
                <strong>Preço com método</strong>
                <p>Custo real, margem definida, posicionamento claro e comunicação de valor.</p>
              </div>
            </div>
            <div className="outcome-grid">
              {outcomes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="proof section-dark spotlight-zone">
          <div className="section-heading reveal-block">
            <p className="eyebrow">Prova e confiança</p>
            <h2>Antes de pedir inscrição, a promessa precisa ser verificável.</h2>
            <p>
              A proposta se sustenta em três sinais: recorte médico, responsabilidade comercial e próximo passo com
              pouco atrito.
            </p>
          </div>
          <div className="proof-grid">
            {proofItems.map(([number, title, text]) => (
              <article className="proof-card reveal-block" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="professor" className="authority section-light">
          <div className="split authority-split">
            <div className="reveal-block">
              <p className="eyebrow">Professor</p>
              <h2>Com Dr. Fábio Rodrigues.</h2>
              <p>
                Dr. Fábio Rodrigues conduz o curso de Precificação Médica dentro da metodologia X5 Med, com foco em
                ajudar médicos a tomarem decisões mais estratégicas sobre preço, margem e sustentabilidade da clínica.
              </p>
              <div className="authority-proof-list" aria-label="Pontos de autoridade do professor">
                <span>Metodologia X5 Med</span>
                <span>Recorte em medicina particular</span>
                <span>Comunicação sem promessa financeira</span>
              </div>
            </div>
            <div className="authority-card tilt-card reveal-block">
              <span className="seal">Precificação X5 Med</span>
              <p>Não é uma formação para vender mais caro. É uma formação para precificar com fundamento.</p>
            </div>
          </div>
        </section>

        <section className="objections section-dark spotlight-zone">
          <div className="section-heading reveal-block">
            <p className="eyebrow">Objeções comuns</p>
            <h2>Se alguma dessas dúvidas trava seu preço, o curso foi desenhado para esse ponto.</h2>
          </div>
          <div className="objection-grid">
            {objections.map(([title, text]) => (
              <article className="objection-card reveal-block" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="formulario" className="section-light">
          <div className="lead-form">
            <div className="form-copy reveal-block">
              <p className="eyebrow">Liberação de inscrição</p>
              <h2>Libere sua inscrição com três dados.</h2>
              <p>
                O primeiro passo deve ser simples: nome, WhatsApp e e-mail. As demais informações ficam opcionais para
                quem quiser receber um contato mais direcionado.
              </p>
              <div className="form-note">
                Menos atrito para o médico interessado. Mais clareza para a equipe comercial quando ele decide avançar.
              </div>
            </div>
            <form className="capture-form reveal-block" noValidate data-checkout="#checkout">
              <label>
                Nome completo
                <input type="text" name="nome" placeholder="Seu nome" autoComplete="name" required />
              </label>
              <label>
                WhatsApp
                <input type="tel" name="whatsapp" placeholder="(00) 00000-0000" autoComplete="tel" inputMode="tel" required />
              </label>
              <label>
                E-mail
                <input type="email" name="email" placeholder="voce@email.com.br" autoComplete="email" required />
              </label>
              <details className="optional-fields">
                <summary>Adicionar informações opcionais</summary>
                <div className="optional-field-grid">
                  <label>
                    CRM
                    <input type="text" name="crm" placeholder="Ex.: CRM-SP 000000" autoComplete="off" />
                  </label>
                  <label>
                    Especialidade
                    <input type="text" name="especialidade" placeholder="Ex.: Dermatologia" autoComplete="organization-title" />
                  </label>
                  <label>
                    Cidade/Estado
                    <input type="text" name="cidade" placeholder="Ex.: Fortaleza/CE" autoComplete="address-level2" />
                  </label>
                  <label>
                    Você atende pacientes particulares hoje?
                    <select name="atende_particular">
                      <option value="">Selecione</option>
                      <option>Sim</option>
                      <option>Não</option>
                      <option>Estou começando</option>
                    </select>
                  </label>
                  <label>
                    Principal desafio com precificação
                    <select name="desafio_precificacao">
                      <option value="">Selecione</option>
                      <option>Não sei quanto cobrar</option>
                      <option>Tenho medo de reajustar</option>
                      <option>Copio preço de colegas</option>
                      <option>Trabalho muito e sobra pouco</option>
                      <option>Tenho dificuldade de comunicar valor</option>
                      <option>Não conheço bem meus custos</option>
                    </select>
                  </label>
                  <label>
                    Valor atual da consulta
                    <select name="valor_consulta">
                      <option value="">Selecione</option>
                      <option>Ainda não atendo particular</option>
                      <option>Até R$ 300</option>
                      <option>R$ 301 a R$ 500</option>
                      <option>R$ 501 a R$ 800</option>
                      <option>Acima de R$ 800</option>
                    </select>
                  </label>
                </div>
              </details>
              <button className="button button-primary form-button" type="submit">
                Liberar minha inscrição
                <ArrowIcon />
              </button>
              <p className="form-microcopy">Depois do envio, você será direcionado para a etapa de inscrição.</p>
              <p className="form-status" role="status" aria-live="polite" />
            </form>
          </div>
        </section>

        <section id="checkout" className="offer section-dark spotlight-zone checkout-section" aria-live="polite">
          <div className="offer-card reveal-block">
            <div>
              <p className="eyebrow">Próximo passo</p>
              <h2>Sua inscrição está quase concluída.</h2>
              <p>
                Agora que você preencheu o formulário, avance para finalizar sua inscrição no Curso de Precificação
                Médica com Dr. Fábio Rodrigues.
              </p>
            </div>
            <div className="offer-panel" aria-label="Resumo da inscrição">
              <span>Você está acessando</span>
              <ul className="offer-list">
                <li>Curso de Precificação Médica</li>
                <li>Formação com Dr. Fábio Rodrigues</li>
                <li>Metodologia X5 Med aplicada à medicina particular</li>
                <li>Orientações de acesso após confirmação da inscrição</li>
              </ul>
              <a className="button button-primary" href={checkoutUrl} aria-label="Finalizar inscrição agora" {...checkoutLinkProps}>
                Finalizar inscrição agora
                <ArrowIcon />
              </a>
              <p>Ao concluir a inscrição, você receberá as informações de acesso conforme a página de pagamento.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="faq section-light">
          <div className="section-heading reveal-block">
            <p className="eyebrow">Dúvidas frequentes</p>
            <h2>Antes de liberar sua inscrição, entenda se o curso faz sentido para você.</h2>
          </div>
          <div className="faq-list reveal-block">
            <details open>
              <summary>Esse curso é só para médicos com clínica grande?</summary>
              <p>
                Não. O curso é indicado para médicos que atendem ou desejam atender pacientes particulares e querem
                precificar com mais método, independentemente do estágio da clínica.
              </p>
            </details>
            <details>
              <summary>Vou sair com o valor exato que devo cobrar?</summary>
              <p>
                Você vai aprender critérios para definir ou revisar seu preço com mais clareza, considerando custos,
                margem, posicionamento e percepção de valor.
              </p>
            </details>
            <details>
              <summary>O curso promete aumento de faturamento?</summary>
              <p>
                Não. A proposta é ensinar fundamentos de precificação, margem e comunicação de valor. Resultados
                financeiros dependem de contexto, execução, mercado, posicionamento e gestão.
              </p>
            </details>
            <details>
              <summary>Preciso ter equipe para aplicar?</summary>
              <p>Não necessariamente. Médicos em consultório individual também podem aplicar os princípios ensinados.</p>
            </details>
            <details>
              <summary>O curso ensina a vender consulta de forma agressiva?</summary>
              <p>
                Não. A abordagem é ética, profissional e adequada à realidade médica. O foco é comunicar valor com
                clareza, não pressionar o paciente.
              </p>
            </details>
          </div>
          <div className="faq-cta reveal-block">
            <a className="button button-primary" href="#formulario">
              Preencher formulário e acessar inscrição
              <ArrowIcon />
            </a>
          </div>
        </section>

        <section className="closing section-dark spotlight-zone">
          <div className="closing-inner reveal-block">
            <p className="eyebrow">Fechamento</p>
            <h2>Você não precisa continuar cobrando por medo, comparação ou improviso.</h2>
            <p>
              Se você quer construir uma prática médica mais sustentável, precisa entender seus números, proteger sua
              margem e posicionar melhor sua entrega.
            </p>
            <a className="button button-primary" href="#formulario">
              Quero parar de cobrar no escuro
              <ArrowIcon />
            </a>
          </div>
        </section>
      </main>

      <a className="mobile-sticky-cta" href="#formulario">
        Liberar inscrição
      </a>

      <footer className="cinematic-footer">
        <div className="cf-aurora" aria-hidden="true" />
        <div className="cf-grid" aria-hidden="true" />
        <div className="cf-bg-text" aria-hidden="true">
          X5 MED
        </div>

        <div className="cf-marquee-bar" aria-hidden="true">
          <div className="cf-marquee-inner">
            {[0, 1].map((item) => (
              <div className="cf-marquee-track" aria-hidden={item === 1 ? "true" : undefined} key={item}>
                <span>Precificação médica</span>
                <span>.</span>
                <span>Preço com método</span>
                <span>.</span>
                <span>Margem protegida</span>
                <span>.</span>
                <span>Comunicação de valor</span>
                <span>.</span>
                <span>Medicina particular</span>
                <span>.</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-body reveal-block">
          <div className="cf-brand">
            <a className="brand" href="#top" aria-label="X5 Med">
              <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" className="brand-logo" />
            </a>
            <p>Precificação médica com método, clareza e responsabilidade.</p>
          </div>
          <nav className="cf-nav" aria-label="Links de navegação">
            <a href="#dor" className="cf-pill">Dor</a>
            <a href="#metodo" className="cf-pill">Método</a>
            <a href="#conteudo" className="cf-pill">Conteúdo</a>
            <a href="#faq" className="cf-pill">FAQ</a>
            <a href="#formulario" className="cf-pill cf-pill-accent">Liberar inscrição</a>
          </nav>
        </div>

        <div className="cf-bottom">
          <p>2026 X5 Med. Todos os direitos reservados.</p>
          <p className="cf-ethics">Conteúdo alinhado às diretrizes éticas de comunicação médica.</p>
          <a className="cf-top-btn" href="#top" aria-label="Voltar ao topo">
            Topo
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 12V4M4 8l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </footer>

      <Script src="/script.js" strategy="afterInteractive" />
    </>
  )
}
