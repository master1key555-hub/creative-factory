"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Strength of magnetic pull. Default 0.25. */
  strength?: number;
};

/**
 * Magnetic hover wrapper: the wrapped element drifts towards the cursor by a
 * fraction of the cursor offset from its center, with a spring return on leave.
 *
 * Wrap a single button or link inside.
 */
export function Magnetic({ children, className, strength = 0.25 }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.3 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
