import Link from "next/link";
import { clientGroups, clients, company, whySigtel } from "@/lib/content/site";
import { EditorialHead } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ParallaxPlate } from "@/components/home/chapter-gallery";

/* A clean company timeline. Only published facts are on it. */
const timeline = [
  {
    year: "2010",
    title: "Incorporated in Navi Mumbai",
    body: "Sigtel Signal & Telecommunication Pvt Ltd is registered in CBD Belapur, Maharashtra.",
  },
  {
    year: "Office",
    title: "Inside the Belapur station building",
    body: "Planning, design, purchase and billing for every site run from ITC Tower No. 8, inside the station building.",
  },
  {
    year: "Practice",
    title: "Signalling at working stations",
    body: "Relay and electronic interlocking modifications, LC gate interlocking and S&T works executed inside running stations.",
  },
  {
    year: "Broadening",
    title: "Telecom for railways and pipelines",
    body: "OFC, SDH and IP-MPLS networks, CCTV, EPABX, VHF radio and NMS along pipeline and railway routes.",
  },
  {
    year: "Today",
    title: "Five states, two disciplines",
    body: "Works recorded across Maharashtra, Goa, Karnataka, Madhya Pradesh and Uttar Pradesh, with AMC / CAMC after handover.",
  },
];

/**
 * Chapter 06 — company information: history as a quiet timeline, the operating
 * principles, and who the work is for.
 */
export function ChapterCompany() {
  return (
    <section id="chapter-06" className="relative border-t border-line bg-white">
      <div className="edge section">
        <EditorialHead
          mark="06 — The company"
          title={["Small enough to", "answer the phone."]}
          deck="Incorporated in 2010 and working from inside the Belapur Railway Station building in Navi Mumbai. Two disciplines with equal depth, and one team accountable for what it builds."
          className="pb-16"
        />

        {/* asymmetric spread: timeline + photograph */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <p className="mb-8 text-[0.86rem] text-tech">History</p>
            <ol className="relative">
              {timeline.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.05}>
                  <li className="group grid grid-cols-[auto_1fr] gap-5 border-t border-line py-6 last:border-b sm:gap-8">
                    <div className="w-[4.5rem] shrink-0">
                      <span className="text-[0.86rem] text-signal tabular">{item.year}</span>
                    </div>
                    <div>
                      <h3 className="text-[clamp(1.1rem,1.7vw,1.34rem)] leading-snug text-eng">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[46ch] text-[0.9rem] leading-[1.65] text-muted">{item.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-6">
            <ParallaxPlate
              src="/images/engineering-survey.jpg"
              alt="Two engineers in light high-visibility vests reviewing signalling drawings beside a rail corridor"
              caption="Site survey · drawings, cable route and working conditions before a price is set"
              index="Fig. 06"
              className="aspect-[4/5] w-full"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
            <Reveal>
              <div className="border-t border-line pt-5">
                <p className="mb-3 text-[0.8rem] text-tech">Office</p>
                <p className="text-[0.9rem] leading-relaxed text-muted">{company.address.office}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem]">
                  <a href={company.phone.primaryHref} className="text-eng hover:text-signal">
                    {company.phone.primary}
                  </a>
                  <a href={`mailto:${company.email}`} className="text-muted hover:text-eng">
                    {company.email}
                  </a>
                  <span className="text-tech">GSTIN {company.gstin}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* operating principles — numbered, hairline-separated */}
        <div className="mt-20">
          <p className="mb-8 text-[0.86rem] text-tech">How we work</p>
          <div className="grid border-t border-line md:grid-cols-2 xl:grid-cols-4">
            {whySigtel.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 0.06}
                className={`relative px-1 py-7 md:px-6 ${index !== 0 ? "border-t border-line xl:border-l xl:border-t-0" : ""} ${
                  index === 2 ? "md:border-t md:border-line xl:border-t-0" : ""
                }`}
              >
                <span className="text-[0.78rem] text-signal tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.05rem] leading-snug text-eng">{item.title}</h3>
                <p className="mt-2 text-[0.86rem] leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* clients — typographic roster, no invented logos */}
      <div className="border-y border-line bg-navy">
        <div className="edge py-14">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="text-[0.86rem] text-tech">Clients &amp; partners</p>
              <p className="mt-4 max-w-[22ch] text-[clamp(1.45rem,2.2vw,1.9rem)] leading-[1.12] text-eng">
                Eleven organisations, one standard of proof.
              </p>
              <p className="mt-4 text-[0.82rem] leading-relaxed text-tech">
                Client relationships as published by SIG-TEL. No logos are reproduced without permission.
              </p>
            </div>
            <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {clients.map((client, index) => (
                <li key={client} className="group flex items-center justify-between gap-3 border-b border-line py-3.5 pr-3">
                  <span className="flex items-center gap-3">
                    <span className="text-[0.76rem] text-tech tabular">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9rem] text-ink/85 transition-colors group-hover:text-eng">{client}</span>
                  </span>
                  <span className="h-px w-3 bg-line-strong transition-all duration-500 group-hover:w-6 group-hover:bg-eng" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 grid gap-px border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-5">
            {clientGroups.map((group) => (
              <div key={group.title} className="py-4 pr-4">
                <p className="text-[0.78rem] text-signal">{group.tag}</p>
                <h4 className="mt-3 text-[1rem] leading-snug text-eng">{group.title}</h4>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{group.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="edge py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-lg text-[0.88rem] leading-relaxed text-muted">
            <span className="text-eng">Sigtel Signal &amp; Telecommunication Pvt Ltd</span> — registered
            office A/5, 19/20, Sector 2, CBD Belapur, Navi Mumbai 400614. Works in railway signalling and
            telecom networks since 2010.
          </p>
          <Link
            href="/about"
            className="link-underline text-[0.9rem] text-eng"
            data-cursor-label="About"
          >
            Read the company profile
          </Link>
        </div>
      </div>
    </section>
  );
}
