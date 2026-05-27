"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { AnimatedWords } from "@/components/motion/animated-words";
import { Magnetic } from "@/components/motion/magnetic";

type HeroProps = {
  siteName: string;
  tagline: string;
};

export function Hero({ siteName, tagline }: HeroProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle parallax on the headline as the user scrolls past the hero.
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative border-b border-border overflow-hidden"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6 }}
            className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/30 blur-[120px]"
            style={{
              animation: reduce ? undefined : "blob 18s ease-in-out infinite",
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.2 }}
            className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]"
            style={{
              animation: reduce
                ? undefined
                : "blob 22s ease-in-out infinite reverse",
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/20 blur-[120px]"
            style={{
              animation: reduce ? undefined : "blob 26s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <motion.div
        style={{ y: headlineY, opacity: headlineOpacity }}
        className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 sm:py-28 md:py-36"
      >
        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-primary mb-6"
        >
          The Journal of {siteName}
        </motion.p>

        <h1 className="serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] max-w-4xl">
          <AnimatedWords text={tagline} delay={0.15} />
        </h1>

        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          A studio and a publication for work that lasts. Essays on craft, notes
          from the studio, and dispatches from the field.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Magnetic>
            <Link
              href="/blog"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/30"
            >
              <span className="relative z-10">Read the Journal</span>
              <span className="absolute inset-0 -z-0 translate-y-full bg-secondary transition-transform duration-500 group-hover:translate-y-0" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium transition-colors hover:bg-muted"
            >
              About us
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
