import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute inset-0 grid-blueprint opacity-30" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(239,68,68,0.07),transparent_70%)]" aria-hidden />
      <div className="edge relative py-24">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-blink" />
          <span className="label text-tech">Signal at danger · Route not set</span>
        </div>
        <p className="mt-8 font-display text-[clamp(5rem,18vw,14rem)] leading-[0.8] tracking-[-0.06em] text-ink/[0.08]">
          404
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.8rem)] uppercase leading-[0.94] tracking-[-0.04em] text-ink">
          This route isn&apos;t set.
        </h1>
        <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">
          The page you were looking for is not in the interlocking. Return to the main line, or tell us what you
          were trying to find.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-solid">
            <span>Back to home</span>
          </Link>
          <Link href="/projects" className="btn">
            <span>Works register</span>
          </Link>
          <Link href="/contact" className="btn">
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
