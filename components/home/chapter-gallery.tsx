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
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(180deg,transparent_0%,rgba(16,41,61,0.55)_100%)] p-4 md:p-6">
          <span className="max-w-[30ch] text-[0.78rem] leading-snug text-white/90">{caption}</span>
          {index ? (
            <span className="text-[0.78rem] tabular text-white/70">{index}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * A photographic band between chapters.
 *
 * The statement sits *under* the photograph on paper rather than on top of it
 * behind a dark scrim: a bright photograph, then a line of large serif type and
 * a short deck in the margin. The image scales down as it enters and then
 * holds — a slow camera settle, no overlay.
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
        { scale: 1.14 },
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
    <div ref={wrap} className={cn("bg-navy", className)}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-800 md:aspect-[21/9]">
        <div ref={media} className="absolute inset-0 will-change-transform">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
        </div>
      </div>

      <div className="edge pb-14 pt-8 md:pb-20 md:pt-10">
        <div className="grid-edit gap-y-6">
          <p className="mark lg:pt-2">{eyebrow}</p>
          <div className="edit-body">
            <p className="text-[clamp(1.8rem,3.9vw,3.4rem)] leading-[1.06] tracking-[-0.016em] text-eng">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
