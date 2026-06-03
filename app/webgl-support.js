"use client"

let cachedSupport

export function canUseWebGL() {
  if (typeof window === "undefined") return false
  if (cachedSupport !== undefined) return cachedSupport

  const canvas = document.createElement("canvas")
  let gl = null

  try {
    gl =
      canvas.getContext("webgl2", { alpha: true, antialias: true }) ||
      canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      canvas.getContext("experimental-webgl", { alpha: true, antialias: true })

    cachedSupport = Boolean(gl)
    gl?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    cachedSupport = false
  }

  canvas.width = 0
  canvas.height = 0
  return cachedSupport
}

export function createWebGLRenderer(factory) {
  if (!canUseWebGL()) return null

  const originalError = console.error
  console.error = (...args) => {
    const message = String(args[0] ?? "")
    if (message.includes("THREE.WebGLRenderer: A WebGL context could not be created")) return
    originalError.apply(console, args)
  }

  try {
    return factory()
  } catch {
    cachedSupport = false
    return null
  } finally {
    console.error = originalError
  }
}
