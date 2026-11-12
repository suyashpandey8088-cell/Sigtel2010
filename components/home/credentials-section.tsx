import { company, credentials, clients } from "@/lib/content/site";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

export function CredentialsSection() {
  return (
    <section className="relative border-t border-line bg-navy py-20 md:py-28">
      <div className="edge">
        <div className="flex flex-col gap-6 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label flex items-center gap-3 text-tech">
              <span className="text-eng">09</span>
              <span className="h-px w-8 bg-line-strong" />
              Company credentials
            </span>
            <h2 className="mt-6 font-display text-display-md uppercase leading-[0.94] text-ink">
              Evidence,
              <br />
              not adjectives.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Only what can be verified is published here: incorporation, registration, the works register and
            the organisations we have worked with.
          </p>
        </div>

        <div className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((item, index) => (
            <Reveal
              key={item.label}
              delay={index * 0.08}
              className={`relative p-6 md:p-8 ${index !== 0 ? "lg:border-l lg:border-line" : ""} ${index % 2 === 1 ? "border-l border-line sm:border-l" : ""} ${index >= 2 ? "border-t border-line sm:border-t lg:border-t-0" : ""}`}
            >
              <p className="font-display text-[clamp(2.6rem,5vw,4.4rem)] leading-none tracking-[-0.04em] text-ink">
                <Counter value={item.value} suffix={item.suffix} />
                {item.label === "Incorporated" ? null : <span className="text-eng">.</span>}
              </p>
              <p className="mt-4 label-tight text-ink/70">{item.label}</p>
              <p className="mt-1 text-[0.78rem] leading-relaxed text-tech">{item.detail}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="label mb-6 text-tech">Clients &amp; partners</p>
            <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
              {clients.map((client, index) => (
                <li
                  key={client}
                  className="group flex items-center justify-between gap-3 border-b border-line py-3.5 pr-2"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[8.5px] tracking-[0.16em] text-tech">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.92rem] text-ink/85 transition-colors group-hover:text-eng">{client}</span>
                  </span>
                  <span className="h-px w-3 bg-line-strong transition-all duration-500 group-hover:w-7 group-hover:bg-eng" />
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-tech">
              Client relationships as published by SIG-TEL. No logos are reproduced without permission.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="corner-ticks border border-line bg-navy-800/60 p-6">
              <p className="label mb-4 text-tech">Registration</p>
              <dl className="space-y-4">
                <div>
                  <dt className="label-tight text-tech">Legal entity</dt>
                  <dd className="mt-1 text-sm text-ink/90">{company.legalName}</dd>
                </div>
                <div>
                  <dt className="label-tight text-tech">GSTIN</dt>
                  <dd className="mt-1 font-mono text-sm tracking-[0.08em] text-ink/90">{company.gstin}</dd>
                </div>
                <div>
                  <dt className="label-tight text-tech">Registered office</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{company.address.regd}</dd>
                </div>
              </dl>
            </div>
            <div className="border border-line bg-eng/[0.06] p-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-eng shadow-[0_0_10px_rgba(36,199,139,0.8)]" />
                <p className="label-tight text-eng">Works register</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                Projects are published with client and division only where the work is recorded. Status reflects
                the register and can change — our team will confirm current status on request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
