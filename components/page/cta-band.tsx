import Link from "next/link";
import { company } from "@/lib/content/site";
import { Magnetic } from "@/components/ui/magnetic";

export function CtaBand({
  eyebrow = "Next step",
  title = "Tell us what the system has to do.",
  body = "Send the tender reference, the drawings or the route. We usually respond the same working day.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-line bg-navy-900">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-30" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eng/50 to-transparent" aria-hidden />
      <div className="edge relative flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <span className="label text-eng">{eyebrow}</span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-[0.96] tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-[0.94rem] leading-relaxed text-muted">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Magnetic>
            <Link href="/contact" className="btn btn-solid" data-cursor-label="Enquire">
              <span>Discuss a project</span>
            </Link>
          </Magnetic>
          <a href={company.phone.primaryHref} className="btn" data-cursor-label="Call">
            <span>{company.phone.primary}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
