;(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const React = window.React
  const ReactDOM = window.ReactDOM

  if (!React || !ReactDOM) {
    return
  }

  const { createElement: h, useEffect, useMemo, useState } = React

  function usePointerVars() {
    const [position, setPosition] = useState({ x: 50, y: 42 })

    useEffect(() => {
      if (reduceMotion) return undefined

      let frame = 0
      const updatePosition = (event) => {
        window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(() => {
          setPosition({
            x: (event.clientX / window.innerWidth) * 100,
            y: (event.clientY / window.innerHeight) * 100,
          })
        })
      }

      window.addEventListener("pointermove", updatePosition, { passive: true })

      return () => {
        window.cancelAnimationFrame(frame)
        window.removeEventListener("pointermove", updatePosition)
      }
    }, [])

    return position
  }

  function useScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
      let frame = 0
      const updateProgress = () => {
        window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0)
        })
      }

      updateProgress()
      window.addEventListener("scroll", updateProgress, { passive: true })
      window.addEventListener("resize", updateProgress)

      return () => {
        window.cancelAnimationFrame(frame)
        window.removeEventListener("scroll", updateProgress)
        window.removeEventListener("resize", updateProgress)
      }
    }, [])

    return progress
  }

  function ReactEffectsLayer() {
    const pointer = usePointerVars()
    const progress = useScrollProgress()
    const traces = useMemo(
      () =>
        Array.from({ length: 18 }, (_, index) => ({
          id: index,
          left: 6 + ((index * 17) % 88),
          top: 7 + ((index * 23) % 82),
          width: 42 + ((index * 19) % 86),
          delay: (index % 9) * 0.42,
          duration: 7 + (index % 5),
        })),
      []
    )

    return h(
      "div",
      {
        className: "react-effects-layer",
        style: {
          "--react-x": `${pointer.x.toFixed(2)}%`,
          "--react-y": `${pointer.y.toFixed(2)}%`,
          "--react-progress": progress.toFixed(4),
        },
      },
      h(
        "div",
        { className: "react-trace-field" },
        traces.map((trace) =>
          h("span", {
            key: trace.id,
            className: "react-trace",
            style: {
              "--trace-left": `${trace.left}%`,
              "--trace-top": `${trace.top}%`,
              "--trace-width": `${trace.width}px`,
              "--trace-delay": `${trace.delay}s`,
              "--trace-duration": `${trace.duration}s`,
            },
          })
        )
      ),
      h("div", { className: "react-cursor-light" }),
      h("div", { className: "react-scanline" })
    )
  }

  function HeroPulse() {
    const stages = ["Atrair", "Posicionar", "Precificar", "Converter"]
    const [activeStage, setActiveStage] = useState(0)

    useEffect(() => {
      if (reduceMotion) return undefined

      const interval = window.setInterval(() => {
        setActiveStage((current) => (current + 1) % stages.length)
      }, 1800)

      return () => window.clearInterval(interval)
    }, [stages.length])

    return h(
      "div",
      { className: "react-hero-pulse-card" },
      h("div", { className: "react-pulse-header" }, h("span", null, "Sistema de crescimento")),
      h(
        "div",
        { className: "react-pulse-steps" },
        stages.map((stage, index) =>
          h(
            "span",
            {
              key: stage,
              className: index === activeStage ? "is-active" : "",
            },
            stage
          )
        )
      ),
      h("div", {
        className: "react-pulse-meter",
        style: { "--pulse-progress": `${((activeStage + 1) / stages.length) * 100}%` },
      })
    )
  }

  const effectsRoot = document.getElementById("react-effects-root")
  const heroRoot = document.getElementById("react-hero-pulse")

  if (effectsRoot) {
    ReactDOM.createRoot(effectsRoot).render(h(ReactEffectsLayer))
  }

  if (heroRoot) {
    ReactDOM.createRoot(heroRoot).render(h(HeroPulse))
  }
})()
