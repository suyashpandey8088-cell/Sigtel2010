import Image from "next/image";
import Link from "next/link";
import { RevealLines, Reveal } from "@/components/ui/reveal";

/**
 * Interior page opening.
 *
 * Same grammar as the home page: breadcrumb in the margin, the title set in the
 * display serif against the wide column, a short deck, then a full-bleed
 * photograph closing the spread. No index numbers, no rules under the type.
 */
export function PageHero({
  title,
  description,
  image,
  imageAlt,
  meta,
  breadcrumb,
}: {
  title: string[];
  description: string;
  image: string;
  imageAlt: string;
  meta?: { label: string; value: string }[];
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-navy">
      <div className="edge pt-[calc(var(--header-h)+2.6rem)]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.84rem]">
          {breadcrumb.map((item, itemIndex) => (
            <span key={item.label} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="link-underline text-muted hover:text-eng">
                  {item.label}
                </Link>
              ) : (
                <span className="text-eng">{item.label}</span>
              )}
              {itemIndex < breadcrumb.length - 1 ? (
                <span className="text-tech/60">/</span>
              ) : null}
            </span>
          ))}
        </nav>

        <div className="grid-edit mt-10 gap-y-8 md:mt-14">
          <div className="edit-wide">
            <h1 className="max-w-[24ch] text-[clamp(2.4rem,6vw,5.6rem)] leading-[0.99] tracking-[-0.02em] text-eng">
              <RevealLines lines={title} />
            </h1>
          </div>
          <div className="edit-body grid gap-x-12 gap-y-6 lg:grid-cols-[1.35fr_0.65fr]">
            <p className="max-w-[52ch] text-[1rem] leading-[1.7] text-ink/80">{description}</p>
            {meta?.length ? (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start">
                {meta.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[0.78rem] text-tech">{item.label}</dt>
                    <dd className="mt-1 text-[0.9rem] leading-snug text-ink/85">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </div>

      <Reveal y={0}>
        <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden bg-navy-800 md:aspect-[21/9]">
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </Reveal>
    </section>
  );
}
