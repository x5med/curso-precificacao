"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { createWebGLRenderer } from "./webgl-support"

// Gráfico de crescimento holográfico (Three.js).
// - Curva ascendente com área preenchida em degradê e grade.
// - A amplitude vertical reflete o valor (ex.: margem 0..100).
// - Anima o "desenho" da esquerda p/ direita (clipping) e um ponto pulsante na ponta.
// - Respeita prefers-reduced-motion e degrada com elegância sem WebGL.

const PROFILE = [0.16, 0.22, 0.19, 0.34, 0.3, 0.46, 0.56, 0.52, 0.7, 0.82, 0.96]
const SAMPLES = 90

export default function HologramGrowth({ value = 50, max = 100 }) {
  const mountRef = useRef(null)
  const ratioRef = useRef(value / max)
  ratioRef.current = Math.max(0, Math.min(1, value / max))

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const renderer = createWebGLRenderer(() =>
      new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    )
    if (!renderer) return // sem WebGL: o texto ao lado continua visível
    renderer.localClippingEnabled = true
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)

    const canvas = renderer.domElement
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    mount.appendChild(canvas)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10, 10)
    camera.position.z = 5

    const CYAN = new THREE.Color(0x70e8ff)

    // Plano de recorte que "desenha" a curva da esquerda p/ direita.
    const revealPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)

    // Grupo da curva (escala vertical = valor).
    const chartGroup = new THREE.Group()
    scene.add(chartGroup)

    // Grade (estática).
    const gridGroup = new THREE.Group()
    scene.add(gridGroup)
    const gridMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.1 })

    // Linha principal + área preenchida.
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x9ff2ff,
      transparent: true,
      opacity: 0.95,
      clippingPlanes: [revealPlane],
    })
    const fillMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      clippingPlanes: [revealPlane],
    })
    const lineGeo = new THREE.BufferGeometry()
    const fillGeo = new THREE.BufferGeometry()
    const line = new THREE.Line(lineGeo, lineMat)
    const fill = new THREE.Mesh(fillGeo, fillMat)
    chartGroup.add(fill)
    chartGroup.add(line)

    // Ponto pulsante na ponta (fora do grupo p/ não distorcer com a escala Y).
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    const dot = new THREE.Mesh(new THREE.CircleGeometry(1, 24), dotMat)
    scene.add(dot)
    const ringMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(new THREE.RingGeometry(1, 1.5, 24), ringMat)
    scene.add(ring)

    let W = 1
    let H = 1
    let tipY = 0 // posição y (unidade) da ponta da curva

    const spline = new THREE.SplineCurve(PROFILE.map((y, i) => new THREE.Vector2(i / (PROFILE.length - 1), y)))
    const pts = spline.getPoints(SAMPLES - 1) // unidade 0..1

    function build() {
      W = Math.max(2, mount.clientWidth || 280)
      H = Math.max(2, mount.clientHeight || 170)
      renderer.setSize(W, H, false)
      camera.right = W
      camera.top = H
      camera.updateProjectionMatrix()

      const pad = H * 0.12
      const usableH = H - pad
      tipY = pad + pts[pts.length - 1].y * usableH

      // Linha.
      const lp = new Float32Array(pts.length * 3)
      for (let i = 0; i < pts.length; i++) {
        lp[i * 3] = pts[i].x * W
        lp[i * 3 + 1] = pad + pts[i].y * usableH
        lp[i * 3 + 2] = 0
      }
      lineGeo.setAttribute("position", new THREE.BufferAttribute(lp, 3))

      // Área (faixa curva→base) com cor por vértice (topo ciano, base escura).
      const n = pts.length
      const fp = new Float32Array(n * 2 * 3)
      const fc = new Float32Array(n * 2 * 3)
      for (let i = 0; i < n; i++) {
        const x = pts[i].x * W
        const yTop = pad + pts[i].y * usableH
        fp[i * 6] = x; fp[i * 6 + 1] = yTop; fp[i * 6 + 2] = 0
        fp[i * 6 + 3] = x; fp[i * 6 + 4] = 0; fp[i * 6 + 5] = 0
        fc[i * 6] = 0.12; fc[i * 6 + 1] = 0.78; fc[i * 6 + 2] = 1.0
        fc[i * 6 + 3] = 0.0; fc[i * 6 + 4] = 0.06; fc[i * 6 + 5] = 0.12
      }
      const idx = []
      for (let i = 0; i < n - 1; i++) {
        const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1
        idx.push(a, b, c, b, d, c)
      }
      fillGeo.setAttribute("position", new THREE.BufferAttribute(fp, 3))
      fillGeo.setAttribute("color", new THREE.BufferAttribute(fc, 3))
      fillGeo.setIndex(idx)

      // Grade horizontal.
      gridGroup.clear()
      for (let g = 1; g <= 3; g++) {
        const y = (H / 4) * g
        gridGroup.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, y, -1), new THREE.Vector3(W, y, -1)]),
          gridMat,
        ))
      }

      const dotR = Math.max(2.5, H * 0.022)
      dot.scale.setScalar(dotR)
      ring.scale.setScalar(dotR)
      dot.position.x = pts[pts.length - 1].x * W
      ring.position.x = dot.position.x

      if (reduceMotion) revealX = W
    }

    let revealX = 0
    let scaleY = reduceMotion ? ratioRef.current * 0.85 + 0.15 : 0

    const ro = new ResizeObserver(build)
    ro.observe(mount)
    build()

    const clock = new THREE.Clock()
    let raf = 0
    function frame() {
      raf = requestAnimationFrame(frame)
      const t = clock.getElapsedTime()

      const targetScale = ratioRef.current * 0.85 + 0.15
      scaleY += (targetScale - scaleY) * 0.1
      chartGroup.scale.y = scaleY

      if (!reduceMotion && revealX < W) {
        revealX += (W + 6 - revealX) * 0.05
        if (revealX > W) revealX = W
      }
      revealPlane.constant = revealX

      // Ponta acompanha a curva (escala atual) e pulsa.
      const tipPy = tipY * scaleY
      dot.position.y = tipPy
      ring.position.y = tipPy
      const drawn = Math.min(1, revealX / (dot.position.x + 1))
      const pulse = reduceMotion ? 1 : 1 + Math.sin(t * 3) * 0.18
      dot.scale.setScalar(Math.max(2.5, H * 0.018) * (drawn > 0.98 ? 1 : 0))
      ring.scale.setScalar(Math.max(2.5, H * 0.018) * pulse * (drawn > 0.98 ? 1 : 0))
      dotMat.opacity = drawn > 0.98 ? 0.95 : 0
      ringMat.opacity = drawn > 0.98 ? (reduceMotion ? 0.4 : 0.5 - (pulse - 1)) : 0

      renderer.render(scene, camera)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      if (canvas.parentNode === mount) mount.removeChild(canvas)
    }
  }, [max])

  return (
    <div className="hologram-growth" role="img" aria-label={`Curva de crescimento — margem ${Math.round(ratioRef.current * max)}%`}>
      <div className="hologram-growth-canvas" ref={mountRef} />
    </div>
  )
}
