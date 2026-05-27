"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = {
  text: string;
  className?: string;
  /** Per-word stagger in seconds. Default 0.06. */
  stagger?: number;
  /** Initial delay in seconds. Default 0. */
  delay?: number;
};

/**
 * Animated headline that reveals each word with a blur→sharp + slide-up effect.
 */
export function AnimatedWords({
  text,
  className,
  stagger = 0.06,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: reduce ? 0 : delay,
          },
        },
      }}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            paddingBottom: "0.12em",
            marginRight: "0.28em",
          }}
        >
          <motion.span
            variants={{
              hidden: reduce
                ? { opacity: 1 }
                : { opacity: 0, y: "100%", filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            style={{ display: "inline-block", willChange: "transform" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
