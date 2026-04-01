import { motion } from 'framer-motion'

void motion

export function GlassCard({ className = '', children, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, rotateX: 2, rotateY: -2, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      className={`rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(56,189,248,0.12)] ${className}`}
    >
      {children}
    </motion.div>
  )
}
