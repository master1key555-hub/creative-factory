"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Slim gold progress bar at the top of the viewport that fills based on
 * how far down the page the user has scrolled.
 */
export function NavProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-primary"
      aria-hidden
    />
  );
}
