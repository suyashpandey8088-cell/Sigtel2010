import Image from "next/image";
import Link from "next/link";
import { RevealLines } from "@/components/ui/reveal";

export function PageHero({
  index,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  meta,
  breadcrumb,
}: {
  index: string;
  eyebrow: string;
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
  meta?: { label: string; value: string }[];
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 hero-scrim" aria-hidden />
      <div className="absolute inset-0 grid-blueprint opacity-25" aria-hidden />

      <div className="edge relative flex min-h-[74vh] flex-col justify-end pb-10 pt-[calc(var(--header-h)+4rem)]">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2">
          {breadcrumb.map((item, index) => (
            <span key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="label-tight text-tech transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="label-tight text-ink/70">{item.label}</span>
              )}
              {index < breadcrumb.length - 1 ? <span className="text-tech/50">/</span> : null}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="label-tight text-eng">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="label text-ink/70">{eyebrow}</span>
        </div>

        <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,6.4vw,6rem)] uppercase leading-[0.92] tracking-[-0.045em] text-ink">
          <RevealLines lines={title} />
        </h1>

        <p className="mt-7 max-w-2xl text-[0.98rem] leading-relaxed text-muted">{description}</p>

        {meta?.length ? (
          <dl className="mt-10 grid gap-6 border-t border-ink/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="label-tight text-tech">{item.label}</dt>
                <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/85">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
