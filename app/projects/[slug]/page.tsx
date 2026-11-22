import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/db";
import { ProjectCard } from "@/components/projects/project-card";
import { CtaBand } from "@/components/page/cta-band";
import { Reveal, RevealLines } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import { company } from "@/lib/content/site";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getStore().getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.shortTitle,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.shortTitle} · SIG-TEL`,
      description: project.summary,
      images: [project.images[0]],
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = getStore();
  const project = await store.getProject(slug);
  if (!project || !project.published) notFound();

  const all = await store.listProjects();
  const related = all.filter((item) => item.id !== project.id && item.division === project.division).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    about: project.division === "signalling" ? "Railway signalling" : "Telecommunications",
    locationCreated: { "@type": "Place", name: `${project.location}, ${project.state}, India` },
    creator: { "@type": "Organization", name: company.legalName, url: company.siteUrl },
    url: `${company.siteUrl}/projects/${project.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article>
        <header className="relative overflow-hidden border-b border-line bg-white">
          <div className="edge pb-12 pt-[calc(var(--header-h)+2.6rem)]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
              <Link href="/" className="text-[0.84rem] text-tech hover:text-ink">Home</Link>
              <span className="text-tech/50">/</span>
              <Link href="/projects" className="text-[0.84rem] text-tech hover:text-ink">Projects</Link>
              <span className="text-tech/50">/</span>
              <span className="text-[0.84rem] text-ink/70">{project.shortTitle}</span>
            </nav>

            <div className="mt-8 flex flex-wrap items-center gap-2">
 <span className="border border-ink/20 px-2.5 py-1 text-[0.78rem] text-ink/80">
                {project.division === "signalling" ? "Railway signalling" : "Telecommunications"}
              </span>
 <span className="flex items-center gap-1.5 border border-ink/15 px-2.5 py-1 text-[0.78rem] text-ink/70">
                <span className={cn("h-[4px] w-[4px] rounded-full", project.status === "completed" ? "bg-eng" : "bg-signal animate-blink")} />
                {project.status === "completed" ? "Completed" : "Ongoing"}
              </span>
              {project.year ? (
                <span className="border border-line px-2.5 py-1 text-[0.8rem] text-muted">
                  {project.year}
                </span>
              ) : null}
            </div>

 <h1 className="mt-6 max-w-5xl font-display text-[clamp(2rem,4.8vw,4.4rem)] leading-[1.0] tracking-[-0.016em] text-eng">
              <RevealLines lines={[project.shortTitle]} />
            </h1>
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{project.summary}</p>

            <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
              {[
                { label: "Client", value: [project.client, project.clientDivision].filter(Boolean).join(" · ") },
                { label: "Location", value: `${project.location}, ${project.state}` },
                { label: "Scope", value: project.division === "signalling" ? "Signalling & S&T works" : "Telecom network works" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[0.8rem] text-tech">{item.label}</dt>
 <dd className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/85">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="edge pb-10">
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-navy-800">
              <Image
                src={project.images[0]}
                alt={`${project.shortTitle} — illustrative image`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <p className="absolute bottom-4 left-4 text-[0.8rem] text-white/85">
                Illustrative of the discipline
              </p>
            </div>
          </div>
        </header>

        <div className="edge grid gap-12 py-16 lg:grid-cols-[1fr_320px] lg:gap-20 lg:py-24">
          <div className="space-y-16">
            <section>
              <SectionLabel index="01" label="Project overview" />
              <p className="mt-5 max-w-3xl text-[1rem] leading-relaxed text-muted">{project.overview}</p>
            </section>

            <section>
              <SectionLabel index="02" label="Scope of work" />
              <ul className="mt-5 grid border-t border-line sm:grid-cols-2">
                {project.scope.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 border-b border-line py-3.5 pr-4">
 <span className="mt-[3px] text-[0.8rem] text-eng">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.86rem] leading-relaxed text-ink/85">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionLabel index="03" label="Technical challenges" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.challenges.map((item) => (
                  <Reveal key={item.title}>
                    <div className="h-full border-t border-line pt-4">
 <h3 className="text-base leading-tight text-ink">{item.title}</h3>
                      <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel index="04" label="Execution approach" />
              <ol className="mt-5 space-y-0 border-t border-line">
                {project.approach.map((item, index) => (
                  <li key={item.title} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[80px_1fr] sm:gap-6">
 <span className="text-[0.86rem] text-tech">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
 <h3 className="text-lg leading-tight text-ink">{item.title}</h3>
                      <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-10 sm:grid-cols-2">
              <div>
                <SectionLabel index="05" label="Equipment & technologies" />
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.equipment.map((item) => (
 <li key={item} className="border border-line/70 px-3 py-1.5 text-[0.8rem] text-ink/75">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel index="06" label="Results & status" />
                <ul className="mt-5 space-y-2.5">
                  {project.results.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted">
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-eng" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <SectionLabel index="07" label="Project gallery" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.images.slice(1, 3).map((image, index) => (
                  <div key={image} className={cn("relative overflow-hidden border border-line", index === 0 ? "aspect-[4/3]" : "aspect-[4/3]")}>
                    <Image
                      src={image}
                      alt={`${project.shortTitle} — illustrative project image ${index + 1}`}
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] hover:scale-[1.03]"
                    />
 <span className="absolute bottom-2 left-2 bg-white px-2 py-1 text-[0.78rem] text-eng/70">
                      Illustrative
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-t border-line pt-5">
              <div className="border-b border-line px-5 py-4">
                <p className="text-[0.84rem] text-tech">Project record</p>
              </div>
              <dl className="space-y-4 px-5 py-5">
                {[
                  ["Client", project.client],
                  ["Division", project.clientDivision || "—"],
                  ["Location", project.location],
                  ["State", project.state],
                  ["Discipline", project.division === "signalling" ? "Railway signalling" : "Telecommunications"],
                  ["Status", project.status === "completed" ? "Completed" : "Ongoing"],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-[0.8rem] text-tech">{label}</dt>
                    <dd className="mt-1 text-[0.85rem] text-ink/85">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="border-t border-line p-5">
                <Magnetic className="w-full">
                  <Link href="/contact" className="btn btn-solid w-full" data-cursor-label="Enquire">
                    <span>Discuss similar work</span>
                  </Link>
                </Magnetic>
 <p className="mt-3 text-center text-[0.78rem] text-tech">
                  Or call {company.phone.primary}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-5">
              <p className="text-[0.8rem] text-tech">Navigation</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/projects" className="link-underline self-start text-sm text-muted hover:text-ink">
                  ← Back to register
                </Link>
                <Link
                  href={project.division === "signalling" ? "/signalling" : "/telecommunications"}
                  className="link-underline self-start text-sm text-muted hover:text-ink"
                >
                  About {project.division === "signalling" ? "signalling" : "telecommunications"}
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="border-t border-line bg-navy py-16">
            <div className="edge">
              <div className="flex items-center justify-between pb-8">
 <h2 className="text-2xl tracking-[-0.02em] text-eng">Related work</h2>
                <Link href="/projects" className="text-[0.84rem] text-eng hover:text-ink">
                  All projects →
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((item, index) => (
                  <ProjectCard key={item.id} project={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <CtaBand />
    </>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-line pb-3">
      <span className="text-[0.78rem] text-tech tabular">{index}</span>
      <h2 className="text-[1.28rem] leading-none text-eng">{label}</h2>
    </div>
  );
}
