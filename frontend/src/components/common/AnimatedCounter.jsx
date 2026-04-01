import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({ value = 0, duration = 1000, suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousRef = useRef(0)

  useEffect(() => {
    let frameId
    const start = performance.now()
    const from = previousRef.current

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(from + (value - from) * eased)
      setDisplayValue(nextValue)
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => {
      previousRef.current = value
      cancelAnimationFrame(frameId)
    }
  }, [value, duration])

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  )
}
