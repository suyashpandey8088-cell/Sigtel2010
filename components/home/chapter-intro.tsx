import Link from "next/link";
import { company, credentials } from "@/lib/content/site";
import { Reveal, ScrollWords } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";

/**
 * Chapter 01 — the opening statement.
 *
 * Deliberately the least "designed" spread on the page: a hanging pull quote,
 * a body column set against it, and the four verified facts on a plain rule.
 * No chapter furniture, no centred axis, no blueprint.
 */
export function ChapterIntro() {
  const [founded, works, states, clients] = credentials;
  const facts = [founded, works, states, clients];

  return (
    <section id="chapter-01" className="bg-navy">
      <div className="edge section">
        <div className="grid-edit gap-y-10">
          <p className="mark lg:pt-2">The company</p>

          <div className="edit-body">
            <p className="pullquote">
              “Two disciplines, one team — signalling for the railway and the
              networks that keep it <em>talking</em>.”
            </p>

            <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              <ScrollWords
                className="text-[0.98rem] leading-[1.7] text-ink/85"
                text="Sigtel Signal & Telecommunication Pvt Ltd was incorporated in 2010 and works in railway signalling and telecommunications with equal depth — for Indian Railways, private sidings, freight terminals and pipeline operators."
              />
              <div className="text-[0.95rem] leading-[1.7] text-muted">
                <p>
                  Signalling work is delivered inside running stations, where
                  the system cannot stop for the installation. Telecom work
                  follows the route: optical fibre, transmission, radio, CCTV
                  and the monitoring that watches all of it.
                </p>
                <p className="mt-4">
                  We stay with what we build — through testing and commissioning
                  and then through the years of maintenance that follow.
                </p>
                <Link
                  href="/about"
                  className="link-underline mt-6 inline-block text-[0.9rem] text-eng"
                  data-cursor-label="About"
                >
                  Read the company profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* verified facts — one rule, four figures, no boxes */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-8 md:mt-24 lg:grid-cols-4">
          {facts.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <p className="text-[clamp(2.4rem,4.2vw,3.4rem)] leading-none text-eng tabular">
                <Counter value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-3 text-[0.88rem] text-ink/80">{item.label}</p>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">{item.detail}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-1 text-[0.8rem] text-tech md:flex-row md:items-center md:justify-between">
          <p>{company.address.office}</p>
          <p>
            GSTIN {company.gstin} · {company.hours}
          </p>
        </div>
      </div>
    </section>
  );
}
