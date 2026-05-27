"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Translation amount in pixels at full scroll. Negative for upward. */
  offset?: number;
};

export function Parallax({ children, className, offset = -60 }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  const yValue: MotionValue<number> | number = reduce ? 0 : y;

  return (
    <motion.div ref={ref} style={{ y: yValue }} className={className}>
      {children}
    </motion.div>
  );
}
