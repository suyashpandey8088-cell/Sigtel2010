import Link from "next/link";
import { company } from "@/lib/content/site";
import { Magnetic } from "@/components/ui/magnetic";

/** Closing band for interior pages: statement on the left, contact on the right. */
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
    <section className="relative overflow-hidden border-t border-line bg-white">
      <div className="edge relative flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-2xl">
          <p className="text-[0.86rem] text-muted">{eyebrow}</p>
          <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.03] tracking-[-0.016em] text-eng">
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
