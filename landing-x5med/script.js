const root = document.documentElement
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  root.style.setProperty("--scroll-progress", progress.toFixed(4))

  const heroFrame = document.querySelector(".hero-frame")
  if (heroFrame && !reduceMotion) {
    const parallax = Math.min(window.scrollY / 900, 1)
    heroFrame.style.setProperty("--parallax", parallax.toFixed(3))
  }
}

updateScrollEffects()
window.addEventListener("scroll", updateScrollEffects, { passive: true })

const revealItems = [...document.querySelectorAll(".reveal-block")]
revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 32, 180)}ms`)
})

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  )

  revealItems.forEach((item) => revealObserver.observe(item))
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"))
}

const growthItems = [...document.querySelectorAll(".growth-animate")]
const counters = [...document.querySelectorAll("[data-count]")]

function animateCounter(counter) {
  const target = Number(counter.dataset.count || 0)
  const duration = 1050
  const start = performance.now()

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    counter.textContent = String(Math.round(target * eased))

    if (progress < 1) {
      window.requestAnimationFrame(tick)
    }
  }

  window.requestAnimationFrame(tick)
}

if (!reduceMotion && "IntersectionObserver" in window) {
  const growthObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        entry.target.classList.add("is-live")
        entry.target.querySelectorAll("[data-count]").forEach((counter) => {
          if (counter.dataset.counted) return
          counter.dataset.counted = "true"
          animateCounter(counter)
        })
        growthObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
  )

  growthItems.forEach((item) => growthObserver.observe(item))
  counters
    .filter((counter) => !counter.closest(".growth-animate"))
    .forEach((counter) => growthObserver.observe(counter))
} else {
  growthItems.forEach((item) => item.classList.add("is-live"))
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.count || "0"
  })
}

const journeySteps = [...document.querySelectorAll(".journey-line span")]
if (journeySteps.length) {
  let activeJourneyStep = 0

  function updateJourneyStep() {
    journeySteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === activeJourneyStep)
    })
    activeJourneyStep = (activeJourneyStep + 1) % journeySteps.length
  }

  updateJourneyStep()

  if (!reduceMotion) {
    window.setInterval(updateJourneyStep, 1400)
  }
}

document.querySelectorAll(".spotlight-zone").forEach((zone) => {
  zone.addEventListener("pointermove", (event) => {
    if (reduceMotion) return
    const rect = zone.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    zone.style.setProperty("--spotlight-x", `${x.toFixed(2)}%`)
    zone.style.setProperty("--spotlight-y", `${y.toFixed(2)}%`)
  })
})

document.querySelectorAll(".capture-form").forEach((form) => {
  const status = form.querySelector(".form-status")
  const submitButton = form.querySelector("button[type='submit']")
  const requiredFields = [...form.querySelectorAll("[required]")]
  const submitLabel = submitButton ? submitButton.innerHTML : ""

  function setStatus(message, type) {
    if (!status) return
    status.textContent = message
    status.classList.remove("is-error", "is-success")
    status.classList.add("is-visible", type === "success" ? "is-success" : "is-error")
  }

  function clearFieldState(field) {
    field.classList.remove("is-invalid")
  }

  function unlockCheckout() {
    const checkoutTarget = form.dataset.checkout
    if (!checkoutTarget) return false

    const checkoutSection = document.querySelector(checkoutTarget)
    checkoutSection?.classList.add("is-unlocked")
    window.setTimeout(() => {
      checkoutSection?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
    }, 220)
    return true
  }

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => clearFieldState(field))
  })

  form.addEventListener("submit", async (event) => {
    event.preventDefault()

    const invalidField = requiredFields.find((field) => !field.value.trim())
    if (invalidField) {
      invalidField.classList.add("is-invalid")
      invalidField.focus()
      setStatus("Preencha nome, WhatsApp e e-mail para liberar a inscrição.", "error")
      return
    }

    const endpoint = form.dataset.endpoint
    if (!endpoint) {
      if (unlockCheckout()) {
        setStatus("Formulário validado. Continue para finalizar sua inscrição.", "success")
        return
      }

      setStatus("O envio ainda precisa de um endpoint ou CRM configurado. Os campos foram validados, mas os dados nao foram enviados.", "error")
      return
    }

    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = "Enviando..."
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })

      if (!response.ok) throw new Error("Lead request failed")

      form.reset()
      unlockCheckout()
      setStatus("Recebemos seus dados. Continue para finalizar sua inscrição.", "success")
    } catch (error) {
      setStatus("Nao foi possivel enviar agora. Tente novamente em instantes.", "error")
    } finally {
      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = submitLabel
      }
    }
  })
})
