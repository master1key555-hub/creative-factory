"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "aside";
  /** Distance in pixels to translate from. Default 24. */
  distance?: number;
};

export function FadeUp({
  children,
  delay = 0,
  duration = 0.7,
  className,
  as = "div",
  distance = 24,
}: Props) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
