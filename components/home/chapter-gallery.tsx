"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

/**
 * A photographic band that moves against the page as it passes — the
 * "asymmetric industrial photograph" of the editorial layout. The scale and
 * vertical offset are scroll-linked; without JavaScript it is a still frame.
 */
export function ParallaxPlate({
  src,
  alt,
  caption,
  index,
  className,
  priority = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  index?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -6, scale: 1.1 },
        {
          yPercent: 6,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <figure ref={wrap} className={cn("relative overflow-hidden bg-navy-800", className)}>
      <div ref={img} className="absolute inset-[-4%] will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
      {caption || index ? (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
          <span className="plate max-w-[24rem] px-3 py-2 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em] text-eng/80">
            {caption}
          </span>
          {index ? (
            <span className="plate px-2.5 py-1.5 font-mono text-[8px] tracking-[0.16em] text-signal">
              {index}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * A full-bleed photographic composition with a single masked statement over it.
 * The image scales down as it enters, then holds — a slow camera settle.
 */
export function RevealPlate({
  src,
  alt,
  eyebrow,
  lines,
  className,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  lines: string[];
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        media.current,
        { scale: 1.16 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom center",
            scrub: 0.7,
          },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className={cn("relative isolate overflow-hidden", className)}>
      <div ref={media} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,43,58,0.28)_0%,rgba(24,43,58,0.12)_38%,rgba(24,43,58,0.62)_100%)]"
        aria-hidden
      />
      <div className="edge relative flex min-h-[74svh] flex-col justify-end pb-12 pt-24">
        <div className="max-w-4xl">
          <span className="label-tight mb-4 flex items-center gap-3 text-white/75">
            <span className="h-[5px] w-[5px] rounded-full bg-signal" />
            {eyebrow}
          </span>
          <p className="font-display text-[clamp(1.8rem,4.4vw,3.9rem)] uppercase leading-[1.02] tracking-[-0.035em] text-white">
            {lines.map((line, i) => (
              <span key={line} className="mask-line">
                <span className="block">{line}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
