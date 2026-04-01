import { motion } from 'framer-motion'

void motion

export function PageContainer({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full pb-20 pt-6"
    >
      {children}
    </motion.main>
  )
}
