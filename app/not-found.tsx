import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(24,59,86,0.05),transparent_70%)]" aria-hidden />
      <div className="edge relative py-24">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-blink rounded-full bg-signal" />
          <span className="text-[0.86rem] text-tech">Signal at danger, route not set</span>
        </div>
        <p className="mt-8 text-[clamp(5rem,18vw,14rem)] leading-[0.85] tracking-[-0.02em] text-eng/[0.08]">
          404
        </p>
        <h1 className="mt-2 max-w-2xl text-[clamp(2rem,4.6vw,3.9rem)] leading-[1.02] tracking-[-0.018em] text-eng">
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
