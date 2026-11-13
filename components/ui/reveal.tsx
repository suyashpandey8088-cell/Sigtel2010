"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Simple fade-and-rise reveal, used for supporting content. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
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
      viewport={{ once, margin: "-10% 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
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
  stagger = 0.085,
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
            initial={reduced ? undefined : { y: "112%" }}
            whileInView={reduced ? undefined : { y: "0%" }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{
              duration: 1.05,
              delay: delay + index * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Scroll-linked word highlighting: as the block passes through the viewport,
 * the words move from secondary to primary ink. Editorial, readable, and it
 * degrades to plain text without JavaScript.
 */
export function ScrollWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  const reduced = useReducedMotion();

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={{ color: "rgba(113,128,138,0.42)" }}
          whileInView={{ color: "rgba(24,43,58,1)" }}
          viewport={{ margin: "-18% 0px -22% 0px" }}
          transition={{ duration: 0.5, delay: index * 0.012, ease: "linear" }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </p>
  );
}
