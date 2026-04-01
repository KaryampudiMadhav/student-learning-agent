import { useState } from 'react'
import { motion } from 'framer-motion'

void motion

export function RippleButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  const [ripple, setRipple] = useState(null)

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    setRipple({ x, y, size, key: Date.now() })
    onClick?.(event)
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      disabled={disabled}
      type={type}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-xl border border-cyan-300/30 bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-2.5 font-medium text-slate-950 transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {ripple && (
        <span
          key={ripple.key}
          className="pointer-events-none absolute animate-[ripple_700ms_ease-out] rounded-full bg-white/70"
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
