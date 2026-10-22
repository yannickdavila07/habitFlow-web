import { useEffect } from 'react'
import { animate, useMotionValue, useTransform, motion } from 'motion/react'

export function Counter({ value }: { value: number }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => Math.round(v).toString())
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.9, ease: 'easeOut' })
    return () => c.stop()
  }, [value, mv])
  return <motion.span>{text}</motion.span>
}
