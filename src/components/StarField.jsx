import { useEffect, useRef } from 'react'

function createStar(width, height) {
  const bright = Math.random() < 0.08

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: bright ? Math.random() * 1.25 + 1.05 : Math.random() * 1.05 + 0.45,
    speed: Math.random() * 0.022 + 0.006,
    phase: Math.random() * Math.PI * 2,
    baseAlpha: Math.random() * 0.32 + 0.2,
    amplitude: Math.random() * 0.5 + 0.22,
    bright
  }
}

export default function StarField({ count = 240 }) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const frameRef = useRef(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const parent = canvas.parentElement
      const width = parent?.clientWidth || window.innerWidth
      const height = parent?.clientHeight || Math.round(window.innerHeight * 0.6)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      sizeRef.current = { width, height, dpr }
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      starsRef.current = Array.from({ length: count }, () => createStar(width, height))
    }

    const draw = () => {
      const { width, height } = sizeRef.current
      context.clearRect(0, 0, width, height)

      for (const star of starsRef.current) {
        if (!reduceMotion) star.phase += star.speed
        const twinkle = (Math.sin(star.phase) + 1) / 2
        const alpha = Math.min(1, star.baseAlpha + twinkle * star.amplitude)

        context.save()
        context.globalAlpha = alpha
        context.fillStyle = '#fffdf5'
        context.beginPath()
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        context.fill()

        if (star.bright) {
          const haloRadius = star.radius * 6.2
          const gradient = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, haloRadius)
          gradient.addColorStop(0, 'rgba(255,255,245,0.9)')
          gradient.addColorStop(0.32, 'rgba(255,234,180,0.34)')
          gradient.addColorStop(1, 'rgba(255,214,140,0)')
          context.globalAlpha = alpha * 0.72
          context.fillStyle = gradient
          context.beginPath()
          context.arc(star.x, star.y, haloRadius, 0, Math.PI * 2)
          context.fill()
        }

        context.restore()
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [count])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
