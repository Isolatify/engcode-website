'use client';

import { useRef, useCallback, type ReactNode, type ElementType } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic hover: the element leans toward the cursor while hovered and
 * springs back on leave. Wrap buttons, links or any single-hit target.
 */
export function Magnetic({
  children,
  as: Tag = 'div',
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      x.set(dx * strength);
      y.set(dy * strength);
    },
    [reduce, strength, x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const MotionTag = motion.create(Tag as ElementType) as typeof motion.div;

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </MotionTag>
  );
}
