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
  ["01", "Preco no achismo", "Voce deixa de escolher honorarios por medo, comparacao ou tentativa."],
  ["02", "Margem invisivel", "Custos, lucro e sustentabilidade entram na conversa de forma objetiva."],
  ["03", "Reajuste com receio", "Voce aprende criterios para avaliar quando e como revisar valores."],
  ["04", "Valor pouco percebido", "Sua comunicacao passa a sustentar melhor a experiencia que voce entrega."],
]

const signals = [
  ["01", "Voce atende mais para compensar preco baixo.", "Mais horarios podem manter o faturamento, mas tambem aumentam desgaste quando a margem nao acompanha."],
  ["02", "O preco do colega vira referencia principal.", "O problema e que voce nao conhece os custos, a estrutura e a estrategia por tras da operacao dele."],
  ["03", "Cada reajuste vira desconforto.", "Sem metodo, aumentar honorarios parece risco pessoal, nao decisao empresarial."],
  ["04", "Valor baixo nao resolve percepcao baixa.", "Quando sua entrega nao e percebida, o paciente tende a comparar pelo menor preco."],
]

const methodItems = [
  ["1", "Custos que passam despercebidos", "Identifique o que precisa entrar na conta antes de definir ou revisar o valor da consulta."],
  ["2", "Faturamento, lucro e margem", "Entenda a diferenca entre volume de atendimento e sustentabilidade financeira."],
  ["3", "Reajuste com criterio", "Avalie quando revisar honorarios sem depender de culpa, medo ou comparacao."],
  ["4", "Comunicacao de valor", "Aprenda a sustentar o valor percebido sem parecer vendedor ou pressionar pacientes."],
  ["5", "Posicionamento e preco", "Alinhe honorarios, experiencia, autoridade e percepcao da clinica."],
  ["6", "Guerra de preco", "Reduza a dependencia de disputar pelo menor valor e aumente clareza sobre sua entrega."],
]

const outcomes = [
  "Preco com fundamento",
  "Reajuste com criterio",
  "Margem mais visivel",
  "Menos comparacao",
  "Comunicacao mais segura",
  "Decisoes menos emocionais",
]

export default function Home() {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="page-backdrop" aria-hidden="true" />

      <div className="top-strip">
        <span>Precificacao Medica</span>
        <strong>Preco com metodo, margem e comunicacao de valor.</strong>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="X5 Med">
          <img src="/assets/Logo%20X5%20Med%20Branca.png" alt="X5 Med" className="brand-logo" />
        </a>
        <nav className="nav" aria-label="Navegacao principal">
          <a href="#dor">Dor</a>
          <a href="#metodo">Metodo</a>
          <a href="#conteudo">Conteudo</a>
          <a href="#professor">Professor</a>
          <a href="#formulario">Inscricao</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#formulario">
          Liberar inscricao
        </a>
      </header>

      <main id="top">
        <section className="hero section-dark spotlight-zone">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy reveal-block">
            <p className="eyebrow">Curso de Precificacao Medica</p>
            <h1>
              Pare de definir o valor da sua consulta <span>no escuro.</span>
            </h1>
            <p className="hero-lead">
              Aprenda a transformar custo, margem e posicionamento em uma decisao de preco mais clara.
            </p>
            <p className="hero-context">
              Uma formacao para medicos que querem parar de cobrar por inseguranca, comparacao ou improviso,
              sem promessa de faturamento e sem venda agressiva.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#formulario">
                Preencher formulario e liberar inscricao
                <ArrowIcon />
              </a>
              <a className="button button-secondary" href="#metodo">
                Ver o metodo
              </a>
            </div>
            <div className="quick-facts" aria-label="Focos do curso">
              <span>Custos e margem</span>
              <span>Reajuste com criterio</span>
              <span>Valor percebido</span>
            </div>
            <div className="hero-trust" aria-label="Compromissos do curso">
              <span>Sem promessa de faturamento</span>
              <span>Sem venda agressiva</span>
              <span>Aplicado a medicina particular</span>
            </div>
          </div>

          <div className="hero-visual reveal-block" aria-label="Visual do curso de Precificacao Medica">
            <div className="hero-frame interactive-video-frame">
              <video
                className="hero-video"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/dr-fabio-poster.jpg"
                aria-label="Dr. Fabio em ambiente premium apresentando a X5 Med"
              >
                <source src="/assets/dr-fabio.mp4" type="video/mp4" />
              </video>
              <div className="frame-scan" aria-hidden="true" />
              <div className="video-interaction-hint" aria-hidden="true">
                <span>Play</span>
              </div>
              <div className="pricing-board" aria-hidden="true">
                <div className="pricing-board-header">
                  <span>Precificacao X5</span>
                  <strong>Metodo de preco</strong>
                </div>
                <div className="pricing-equation">
                  <span>Custo real</span>
                  <i>+</i>
                  <span>Margem</span>
                  <i>+</i>
                  <span>Valor percebido</span>
                </div>
                <div className="margin-meter">
                  <span>Margem alvo</span>
                  <strong>visivel</strong>
                </div>
              </div>
              <div className="pricing-note pricing-note-top" aria-hidden="true">
                <span>Decisao de preco</span>
                <strong>Menos comparacao. Mais fundamento.</strong>
              </div>
              <div className="pricing-note pricing-note-bottom" aria-hidden="true">
                <span>Clareza comercial</span>
                <strong>Comunicar valor sem pressionar o paciente.</strong>
              </div>
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
              <span>acesso flexivel</span>
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
              Muitos medicos trabalham muito, atendem bem e ainda sentem que a clinica nao cresce com a saude
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
            <p className="eyebrow">Quebra de crenca</p>
            <h2>Preco nao e apenas numero. E estrategia de clinica.</h2>
            <p>
              O valor da consulta comunica posicionamento, seguranca, experiencia e percepcao de cuidado. Quando
              essas pecas nao conversam, o preco parece fragil.
            </p>
            <div className="formula" aria-label="Pilares da precificacao medica">
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
              <p className="eyebrow">A solucao</p>
              <h2>Uma formacao pratica para medicos que querem cobrar com mais clareza.</h2>
            </div>
            <div className="solution-card reveal-block">
              <p>
                O curso ensina voce a analisar o preco da consulta e dos servicos medicos com uma logica mais
                empresarial, sem perder a responsabilidade etica da medicina.
              </p>
              <div className="principles">
                <span>Criterios para definir preco</span>
                <span>Leitura de margem e sustentabilidade</span>
                <span>Comunicacao de valor sem pressao</span>
              </div>
            </div>
          </div>
        </section>

        <section id="conteudo" className="method section-dark spotlight-zone">
          <div className="section-heading reveal-block">
            <p className="eyebrow">O que voce aprende</p>
            <h2>Da inseguranca no preco para uma decisao com metodo.</h2>
            <p>
              O objetivo nao e entregar uma tabela pronta. E ensinar criterios para voce decidir de acordo com a
              realidade da sua pratica medica.
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

        <section className="journey section-light">
          <div className="section-heading compact reveal-block">
            <p className="eyebrow">Mecanismo</p>
            <h2>Quem nao comunica valor acaba discutindo preco.</h2>
            <p>O curso conecta os pontos que tornam a precificacao mais madura na medicina particular.</p>
          </div>
          <div className="journey-line pricing-line reveal-block">
            <span>Calculo financeiro</span>
            <span>Margem protegida</span>
            <span>Posicionamento</span>
            <span>Experiencia</span>
            <span>Comunicacao</span>
            <span>Decisao</span>
          </div>
          <p className="journey-note reveal-block">
            Precificacao medica comeca nos numeros, mas nao termina neles. Ela precisa aparecer na forma como o
            paciente percebe sua clinica.
          </p>
        </section>

        <section id="para-quem" className="audience section-dark spotlight-zone">
          <div className="split">
            <div className="reveal-block">
              <p className="eyebrow">Para quem e</p>
              <h2>Para medicos que querem parar de cobrar por tentativa.</h2>
              <p>
                Indicado para medicos que atendem ou desejam atender pacientes particulares e querem organizar melhor
                sua logica de honorarios.
              </p>
            </div>
            <ul className="check-list reveal-block">
              <li>Voce sente inseguranca para definir ou reajustar o valor da consulta.</li>
              <li>Usa o preco de colegas como referencia principal.</li>
              <li>Trabalha muito, mas sente que sobra pouco.</li>
              <li>Nao sabe calcular com clareza seus custos.</li>
              <li>Quer proteger melhor sua margem.</li>
              <li>Tem dificuldade de comunicar valor sem parecer vendedor.</li>
            </ul>
          </div>
          <div className="not-for reveal-block">
            <strong>Nao e para quem procura promessa de faturamento rapido.</strong>
            <span>Tambem nao e para quem busca formula magica, venda agressiva ou uma tabela universal de preco.</span>
          </div>
        </section>

        <section className="transformation section-light">
          <div className="transformation-panel reveal-block">
            <p className="eyebrow">Transformacao esperada</p>
            <h2>Depois do curso, sua pergunta deixa de ser "quanto o mercado cobra?".</h2>
            <p>
              Voce passa a analisar quanto sua operacao exige, qual margem precisa preservar, como seu posicionamento
              sustenta esse valor e como comunicar isso com clareza.
            </p>
            <div className="before-after-grid" aria-label="Comparacao visual da transformacao">
              <div>
                <span>Antes</span>
                <strong>Preco pelo medo</strong>
                <p>Colega como referencia, reajuste desconfortavel e margem invisivel.</p>
              </div>
              <div>
                <span>Depois</span>
                <strong>Preco com metodo</strong>
                <p>Custo real, margem definida, posicionamento claro e comunicacao de valor.</p>
              </div>
            </div>
            <div className="outcome-grid">
              {outcomes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="professor" className="authority section-dark spotlight-zone">
          <div className="split authority-split">
            <div className="reveal-block">
              <p className="eyebrow">Professor</p>
              <h2>Com Dr. Fabio Rodrigues.</h2>
              <p>
                Dr. Fabio Rodrigues conduz o curso de Precificacao Medica dentro da metodologia X5 Med, com foco em
                ajudar medicos a tomarem decisoes mais estrategicas sobre preco, margem e sustentabilidade da clinica.
              </p>
            </div>
            <div className="authority-card tilt-card reveal-block">
              <span className="seal">Precificacao X5 Med</span>
              <p>Nao e uma formacao para vender mais caro. E uma formacao para precificar com fundamento.</p>
            </div>
          </div>
        </section>

        <section id="formulario" className="section-light">
          <div className="lead-form">
            <div className="form-copy reveal-block">
              <p className="eyebrow">Liberacao de inscricao</p>
              <h2>Preencha o formulario para liberar o acesso a inscricao.</h2>
              <p>
                Antes de acessar o checkout, responda as informacoes abaixo. Isso ajuda a X5 Med a entender seu momento
                atual e direcionar melhor a comunicacao sobre o curso.
              </p>
              <div className="form-note">
                Apenas nome, WhatsApp e e-mail sao obrigatorios. As demais respostas ajudam a personalizar o contato.
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
                <input type="email" name="email" placeholder="voce@email.com" autoComplete="email" required />
              </label>
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
                Voce atende pacientes particulares hoje?
                <select name="atende_particular">
                  <option value="">Selecione</option>
                  <option>Sim</option>
                  <option>Nao</option>
                  <option>Estou comecando</option>
                </select>
              </label>
              <label>
                Principal desafio com precificacao
                <select name="desafio_precificacao">
                  <option value="">Selecione</option>
                  <option>Nao sei quanto cobrar</option>
                  <option>Tenho medo de reajustar</option>
                  <option>Copio preco de colegas</option>
                  <option>Trabalho muito e sobra pouco</option>
                  <option>Tenho dificuldade de comunicar valor</option>
                  <option>Nao conheco bem meus custos</option>
                </select>
              </label>
              <label>
                Valor atual da consulta
                <select name="valor_consulta">
                  <option value="">Selecione</option>
                  <option>Ainda nao atendo particular</option>
                  <option>Ate R$ 300</option>
                  <option>R$ 301 a R$ 500</option>
                  <option>R$ 501 a R$ 800</option>
                  <option>Acima de R$ 800</option>
                </select>
              </label>
              <label>
                Fez reajuste nos ultimos 12 meses?
                <select name="reajuste_12_meses">
                  <option value="">Selecione</option>
                  <option>Sim</option>
                  <option>Nao</option>
                  <option>Ainda nao sei como fazer</option>
                </select>
              </label>
              <button className="button button-primary form-button" type="submit">
                Enviar formulario e liberar checkout
                <ArrowIcon />
              </button>
              <p className="form-microcopy">Depois do envio, voce sera direcionado para a etapa de inscricao.</p>
              <p className="form-status" role="status" aria-live="polite" />
            </form>
          </div>
        </section>

        <section id="checkout" className="offer section-dark spotlight-zone checkout-section" aria-live="polite">
          <div className="offer-card reveal-block">
            <div>
              <p className="eyebrow">Proximo passo</p>
              <h2>Sua inscricao esta quase concluida.</h2>
              <p>
                Agora que voce preencheu o formulario, acesse o link abaixo para finalizar sua inscricao no Curso de
                Precificacao Medica com Dr. Fabio Rodrigues.
              </p>
            </div>
            <div className="offer-panel" aria-label="Resumo da inscricao">
              <span>Voce esta acessando</span>
              <ul className="offer-list">
                <li>Curso de Precificacao Medica</li>
                <li>Formacao com Dr. Fabio Rodrigues</li>
                <li>Metodologia X5 Med aplicada a medicina particular</li>
                <li>Orientacoes de acesso apos confirmacao da inscricao</li>
              </ul>
              <a className="button button-primary" href="#checkout" aria-label="Finalizar inscricao agora">
                Finalizar inscricao agora
                <ArrowIcon />
              </a>
              <p>Ao concluir a inscricao, voce recebera as informacoes de acesso conforme a pagina de pagamento.</p>
            </div>
          </div>
        </section>

        <section id="faq" className="faq section-light">
          <div className="section-heading reveal-block">
            <p className="eyebrow">Duvidas frequentes</p>
            <h2>Antes de liberar sua inscricao, entenda se o curso faz sentido para voce.</h2>
          </div>
          <div className="faq-list reveal-block">
            <details open>
              <summary>Esse curso e so para medicos com clinica grande?</summary>
              <p>
                Nao. O curso e indicado para medicos que atendem ou desejam atender pacientes particulares e querem
                precificar com mais metodo, independentemente do estagio da clinica.
              </p>
            </details>
            <details>
              <summary>Vou sair com o valor exato que devo cobrar?</summary>
              <p>
                Voce vai aprender criterios para definir ou revisar seu preco com mais clareza, considerando custos,
                margem, posicionamento e percepcao de valor.
              </p>
            </details>
            <details>
              <summary>O curso promete aumento de faturamento?</summary>
              <p>
                Nao. A proposta e ensinar fundamentos de precificacao, margem e comunicacao de valor. Resultados
                financeiros dependem de contexto, execucao, mercado, posicionamento e gestao.
              </p>
            </details>
            <details>
              <summary>Preciso ter equipe para aplicar?</summary>
              <p>Nao necessariamente. Medicos em consultorio individual tambem podem aplicar os principios ensinados.</p>
            </details>
            <details>
              <summary>O curso ensina a vender consulta de forma agressiva?</summary>
              <p>
                Nao. A abordagem e etica, profissional e adequada a realidade medica. O foco e comunicar valor com
                clareza, nao pressionar o paciente.
              </p>
            </details>
          </div>
          <div className="faq-cta reveal-block">
            <a className="button button-primary" href="#formulario">
              Preencher formulario e acessar inscricao
              <ArrowIcon />
            </a>
          </div>
        </section>

        <section className="closing section-dark spotlight-zone">
          <div className="closing-inner reveal-block">
            <p className="eyebrow">Fechamento</p>
            <h2>Voce nao precisa continuar cobrando por medo, comparacao ou improviso.</h2>
            <p>
              Se voce quer construir uma pratica medica mais sustentavel, precisa entender seus numeros, proteger sua
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
        Liberar inscricao
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
                <span>Precificacao medica</span>
                <span>.</span>
                <span>Preco com metodo</span>
                <span>.</span>
                <span>Margem protegida</span>
                <span>.</span>
                <span>Comunicacao de valor</span>
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
            <p>Precificacao medica com metodo, clareza e responsabilidade.</p>
          </div>
          <nav className="cf-nav" aria-label="Links de navegacao">
            <a href="#dor" className="cf-pill">Dor</a>
            <a href="#metodo" className="cf-pill">Metodo</a>
            <a href="#conteudo" className="cf-pill">Conteudo</a>
            <a href="#faq" className="cf-pill">FAQ</a>
            <a href="#formulario" className="cf-pill cf-pill-accent">Liberar inscricao</a>
          </nav>
        </div>

        <div className="cf-bottom">
          <p>2026 X5 Med. Todos os direitos reservados.</p>
          <p className="cf-ethics">Conteudo alinhado as diretrizes eticas de comunicacao medica.</p>
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
