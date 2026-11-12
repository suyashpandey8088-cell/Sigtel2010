"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? undefined : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -10% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Line-by-line masked reveal for headings. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("block", className)}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="mask-line">
          <motion.span
            className={cn("block", lineClassName)}
            initial={reduced ? undefined : { y: "110%", opacity: 0 }}
            whileInView={reduced ? undefined : { y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, delay: delay + index * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
