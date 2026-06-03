"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { createWebGLRenderer } from "./webgl-support"

// Holograma 3D interativo do placar de sinais.
// - O anel preenche conforme `score` (0..max).
// - Cor migra de ciano (ok) para âmbar/vermelho (risco alto).
// - Interativo: o conjunto inclina seguindo o ponteiro e gira ao arrastar.
// - Respeita prefers-reduced-motion (desliga flicker/auto-rotação).

const HOLO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const HOLO_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uFlicker;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.0);
    float scan = sin(vWorldPos.y * 58.0 - uTime * 3.5) * 0.5 + 0.5;
    scan = smoothstep(0.25, 1.0, scan);
    float flick = mix(1.0, 0.82 + 0.18 * sin(uTime * 28.0), uFlicker);
    float alpha = (0.22 + fres * 0.95) * uOpacity * flick * (0.62 + 0.38 * scan);
    vec3 col = uColor * (0.55 + fres * 1.5);
    gl_FragColor = vec4(col, alpha);
  }
`

const TAU = Math.PI * 2

function makeHoloMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 1 },
      uFlicker: { value: 1 },
    },
    vertexShader: HOLO_VERT,
    fragmentShader: HOLO_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

export default function HologramScore({
  score = 0,
  max = 4,
  positiveHigh = false,
  showReadout = true,
  display,
  unit = "sinais",
}) {
  const mountRef = useRef(null)
  const scoreRef = useRef(score)
  scoreRef.current = Math.max(0, Math.min(max, score))
  const positiveHighRef = useRef(positiveHigh)
  positiveHighRef.current = positiveHigh

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const renderer = createWebGLRenderer(() =>
      new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" })
    )
    if (!renderer) return // sem WebGL: o texto sobreposto (HTML) continua visível

    const size = Math.max(120, mount.clientWidth || 180)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(size, size, false)
    renderer.setClearColor(0x000000, 0)
    const canvas = renderer.domElement
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.display = "block"
    canvas.style.touchAction = "pan-y"
    mount.appendChild(canvas)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 6.4)

    // Grupo que recebe a interação (tilt + arrasto).
    const group = new THREE.Group()
    scene.add(group)

    const COLOR_LOW = new THREE.Color(0x70e8ff)
    const COLOR_HIGH = new THREE.Color(0xff5a6e)

    // Trilho (anel completo, discreto).
    const trackMat = makeHoloMaterial(0x2a4f63)
    trackMat.uniforms.uOpacity.value = 0.5
    const track = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.06, 20, 140), trackMat)
    group.add(track)

    // Arco de progresso (recriado quando o score muda).
    const progMat = makeHoloMaterial(0x70e8ff)
    let progress = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.11, 22, 8, 0.001), progMat)
    progress.rotation.z = Math.PI / 2 // começa no topo
    group.add(progress)
    let progressArc = -1 // força build inicial

    function buildProgress(arc) {
      progress.geometry.dispose()
      const seg = Math.max(8, Math.round((arc / TAU) * 140))
      progress.geometry = new THREE.TorusGeometry(1.55, 0.11, 22, seg, Math.max(0.001, arc))
    }

    // Núcleo holográfico (icosaedro em wireframe que pulsa).
    const coreMat = makeHoloMaterial(0x70e8ff)
    coreMat.uniforms.uOpacity.value = 0.7
    const core = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(0.92, 1)),
      coreMat,
    )
    group.add(core)

    // Poeira holográfica (partículas).
    const PARTICLES = 90
    const positions = new Float32Array(PARTICLES * 3)
    for (let i = 0; i < PARTICLES; i++) {
      const r = 0.6 + Math.random() * 1.7
      const a = Math.random() * TAU
      const y = (Math.random() - 0.5) * 2.6
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(a) * r
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x9ff2ff,
      size: 0.05,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    group.add(particles)

    // ---- Interação ----
    const pointer = { x: 0, y: 0 } // alvo de tilt (-1..1)
    const tilt = { x: 0, y: 0 }
    let hoverTarget = 0
    let hover = 0
    let spinVel = 0 // velocidade de giro residual (arrasto)
    let spin = 0
    let dragging = false
    let lastX = 0

    function onMove(e) {
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - (rect.left + rect.width / 2)
      const cy = e.clientY - (rect.top + rect.height / 2)
      pointer.x = Math.max(-1, Math.min(1, cx / (rect.width / 2)))
      pointer.y = Math.max(-1, Math.min(1, cy / (rect.height / 2)))
      if (dragging) {
        spinVel += ((e.clientX - lastX) / rect.width) * 0.4
        lastX = e.clientX
      }
    }
    function onEnter() { hoverTarget = 1 }
    function onLeave() { hoverTarget = 0; pointer.x = 0; pointer.y = 0 }
    function onDown(e) { dragging = true; lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId) }
    function onUp(e) { dragging = false; canvas.releasePointerCapture?.(e.pointerId) }

    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerenter", onEnter)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointerup", onUp)

    // Resize responsivo.
    const ro = new ResizeObserver(() => {
      const s = Math.max(120, mount.clientWidth || 180)
      renderer.setSize(s, s, false)
    })
    ro.observe(mount)

    // ---- Loop ----
    const clock = new THREE.Clock()
    let raf = 0
    const tmpColor = new THREE.Color()

    function frame() {
      raf = requestAnimationFrame(frame)
      const t = clock.getElapsedTime()
      const ratio = scoreRef.current / max

      // Arco alvo (com leve folga p/ animação suave via lerp do uniform).
      const targetArc = Math.max(0.001, ratio * TAU)
      if (Math.abs(targetArc - progressArc) > 0.001) {
        progressArc += (targetArc - progressArc) * 0.18
        if (Math.abs(targetArc - progressArc) < 0.01) progressArc = targetArc
        buildProgress(progressArc)
      }

      // Cor por nível. positiveHigh inverte: alto = bom (ciano), baixo = alerta (vermelho).
      const cf = Math.min(1, ratio * 1.05)
      tmpColor.copy(COLOR_LOW).lerp(COLOR_HIGH, positiveHighRef.current ? 1 - cf : cf)
      progMat.uniforms.uColor.value.copy(tmpColor)
      coreMat.uniforms.uColor.value.copy(tmpColor)
      pMat.color.copy(tmpColor).lerp(new THREE.Color(0xffffff), 0.3)

      // Tilt + hover + spin.
      hover += (hoverTarget - hover) * 0.08
      tilt.x += (pointer.y * 0.5 - tilt.x) * 0.07
      tilt.y += (pointer.x * 0.6 - tilt.y) * 0.07
      spin += spinVel
      spinVel *= 0.93

      const idle = reduceMotion ? 0 : Math.sin(t * 0.5) * 0.12
      group.rotation.x = tilt.x
      group.rotation.y = tilt.y + spin + idle
      group.rotation.z = 0

      const pulse = reduceMotion ? 1 : 1 + Math.sin(t * 1.6) * 0.04
      core.scale.setScalar(pulse)
      core.rotation.y = reduceMotion ? 0 : t * 0.3
      core.rotation.x = reduceMotion ? 0 : t * 0.18
      particles.rotation.y = reduceMotion ? 0 : -t * 0.12

      const boost = 1 + hover * 0.5
      progMat.uniforms.uOpacity.value = boost
      coreMat.uniforms.uOpacity.value = 0.55 + hover * 0.35
      const flick = reduceMotion ? 0 : 1
      progMat.uniforms.uFlicker.value = flick
      coreMat.uniforms.uFlicker.value = flick
      trackMat.uniforms.uFlicker.value = 0

      progMat.uniforms.uTime.value = t
      coreMat.uniforms.uTime.value = t
      trackMat.uniforms.uTime.value = t

      renderer.render(scene, camera)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerenter", onEnter)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointerup", onUp)
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
    <div className="hologram-score" role="img" aria-label={`${scoreRef.current} de ${max} sinais marcados`}>
      <div className="hologram-canvas" ref={mountRef} />
      {showReadout ? (
        <div className="hologram-readout" aria-hidden="true">
          <strong>{display ?? `${scoreRef.current}/${max}`}</strong>
          <span>{unit}</span>
        </div>
      ) : null}
    </div>
  )
}
