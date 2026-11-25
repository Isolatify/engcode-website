'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Kinetic text: words stagger up on scroll-in; hovering the block triggers a
 * short staggered wave (each word jumps, left to right).
 *
 * Implementation notes:
 * - The scroll-in animation is framer-motion variants (opacity + transform).
 * - The hover wave is a CSS keyframe animation driven by a class, so it
 *   temporarily overrides the inline transform and cleanly reverts — it never
 *   fights the variants (mixing whileHover variants caused glitches).
 * - Gradient text applies the clip to EACH moving word span. A gradient on a
 *   wrapper breaks when children transform: background-clip: text stops
 *   painting behind transformed descendants, so the text vanished on hover.
 */
export function KineticText({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
  hoverPlay = true,
  gradient = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  hoverPlay?: boolean;
  gradient?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = motion[Tag] as typeof motion.span;
  const [waving, setWaving] = useState(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (clearTimer.current) clearTimeout(clearTimer.current); }, []);

  if (reduce) {
    const Static = Tag as 'span';
    return <Static className={className}>{text}</Static>;
  }

  const startWave = () => {
    if (!hoverPlay || waving) return;
    setWaving(true);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    const total = words.length * 30 + 500;
    clearTimer.current = setTimeout(() => setWaving(false), total);
  };

  return (
    <MotionTag
      className={`inline-block kinetic-text ${waving ? 'kinetic-wave' : ''} ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      onHoverStart={startWave}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block whitespace-nowrap" aria-hidden="true">
          <motion.span
            className={`kinetic-word inline-block ${gradient ? 'text-gradient' : ''}`}
            style={{ '--i': i } as React.CSSProperties}
            variants={{
              hidden: { opacity: 0, y: 26, rotate: -2 },
              show: {
                opacity: 1,
                y: 0,
                rotate: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
