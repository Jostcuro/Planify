import { motion, stagger, useAnimate } from 'framer-motion'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  filter?: boolean
  duration?: number
}

export function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate()
  const wordsArray = words.split(' ')

  useEffect(() => {
    void animate(
      'span',
      { opacity: 1, filter: filter ? 'blur(0px)' : 'none' },
      { duration: duration ?? 1, delay: stagger(0.12) },
    )
  }, [scope.current, animate, duration, filter])

  return (
    <div className={cn('font-bold', className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="opacity-0"
            style={{ filter: filter ? 'blur(10px)' : 'none' }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
