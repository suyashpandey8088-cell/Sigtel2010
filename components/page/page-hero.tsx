import Image from "next/image";
import Link from "next/link";
import { RevealLines } from "@/components/ui/reveal";

/**
 * Interior page opening. A bright photograph in a wide band, the breadcrumb, a
 * small index, and oversized type on paper — the same editorial grammar as the
 * home page, at a shorter length.
 */
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
    <section className="relative border-b border-line bg-white">
      <div className="edge pt-[calc(var(--header-h)+2.4rem)]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
          {breadcrumb.map((item, itemIndex) => (
            <span key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="label-tight text-muted transition-colors hover:text-eng">
                  {item.label}
                </Link>
              ) : (
                <span className="label-tight text-eng">{item.label}</span>
              )}
              {itemIndex < breadcrumb.length - 1 ? <span className="text-tech/60">/</span> : null}
            </span>
          ))}
        </nav>

        <div className="mt-10 flex items-center gap-4">
          <span className="label-index">{index}</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span className="label text-muted">{eyebrow}</span>
        </div>

        <h1 className="mt-6 max-w-[62rem] font-display text-[clamp(2.5rem,6.2vw,5.9rem)] uppercase leading-[0.94] tracking-[-0.045em] text-eng">
          <RevealLines lines={title} />
        </h1>

        <div className="mt-8 grid gap-8 border-t border-line pt-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <p className="max-w-2xl text-[0.98rem] leading-relaxed text-muted">{description}</p>
          {meta?.length ? (
            <dl className="grid grid-cols-2 gap-5">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="label-tight text-tech">{item.label}</dt>
                  <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink/85">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <div className="edge mt-10 pb-10">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-navy-800">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
          <span className="plate absolute bottom-4 left-4 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-eng/80">
            {eyebrow}
          </span>
        </div>
      </div>
    </section>
  );
}
