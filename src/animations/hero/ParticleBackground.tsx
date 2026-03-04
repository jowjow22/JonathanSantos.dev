import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  baseVx: number
  baseVy: number
  glowing: boolean
  alpha: number
  isBurst: boolean
}

// Dark mode: lighter purples visible against dark bg
const PARTICLE_COLORS_DARK = ['#6366f1', '#818cf8', '#a78bfa', '#7c3aed']
// Light mode: deeper indigos/violets with higher contrast against light bg
const PARTICLE_COLORS_LIGHT = [
  '#3730a3',
  '#4338ca',
  '#4f46e5',
  '#6d28d9',
  '#5b21b6',
]
const PARTICLE_COUNT = 220
const REPEL_RADIUS = 110
const REPEL_STRENGTH = 3.5

function isLightTheme(): boolean {
  return document.documentElement.classList.contains('light')
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function createParticle(width: number, height: number): Particle {
  const glowing = Math.random() < 0.35
  const baseVx = randomBetween(-0.3, 0.3)
  const baseVy = randomBetween(-0.6, -0.2)
  const light = isLightTheme()
  const colors = light ? PARTICLE_COLORS_LIGHT : PARTICLE_COLORS_DARK
  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    radius: randomBetween(1, glowing ? 2.5 : 1.8),
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: baseVx,
    vy: baseVy,
    baseVx,
    baseVy,
    glowing,
    alpha: light ? randomBetween(0.75, 1.0) : randomBetween(0.55, 0.9),
    isBurst: false,
  }
}

function createBurstParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = randomBetween(2.5, 7)
  const colors = isLightTheme() ? PARTICLE_COLORS_LIGHT : PARTICLE_COLORS_DARK
  const color = colors[Math.floor(Math.random() * colors.length)]
  return {
    x,
    y,
    radius: randomBetween(1.5, 3.5),
    color,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    baseVx: 0,
    baseVy: 0,
    glowing: true,
    alpha: 1,
    isBurst: true,
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    const mouse = { x: -9999, y: -9999 }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    function reinitParticles() {
      if (!canvas) return
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        mouse.x = -9999
        mouse.y = -9999
      } else {
        mouse.x = x
        mouse.y = y
      }
    }

    function onClick(e: MouseEvent) {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return
      for (let i = 0; i < 30; i++) {
        particles.push(createBurstParticle(x, y))
      }
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const surviving: Particle[] = []

      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (!p.isBurst && dist < REPEL_RADIUS && dist > 0) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        if (!p.isBurst) {
          p.vx += (p.baseVx - p.vx) * 0.05
          p.vy += (p.baseVy - p.vy) * 0.05
        } else {
          p.alpha -= 0.022
          p.vx *= 0.94
          p.vy *= 0.94
          if (p.alpha <= 0) continue
        }

        surviving.push(p)

        ctx.beginPath()
        if (p.glowing) {
          ctx.shadowBlur = 14
          ctx.shadowColor = p.color
        } else {
          ctx.shadowBlur = 0
          ctx.shadowColor = 'transparent'
        }
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (!p.isBurst) {
          if (p.y + p.radius < 0) {
            p.y = canvas.height + p.radius
            p.x = randomBetween(0, canvas.width)
          }
          if (p.x + p.radius < 0) p.x = canvas.width + p.radius
          if (p.x - p.radius > canvas.width) p.x = -p.radius
        }
      }

      particles = surviving

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)

    // Re-create particles when theme class changes on <html>
    const themeObserver = new MutationObserver(() => {
      reinitParticles()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelAnimationFrame(animationId)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
