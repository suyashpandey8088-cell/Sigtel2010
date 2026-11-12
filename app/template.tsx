/**
 * Route-level transition: a restrained fade so navigation feels continuous.
 *
 * Deliberately CSS-driven, not JavaScript-driven. A client-animated wrapper
 * would server-render every page inside `opacity:0` and only reveal it once the
 * bundle hydrated — so a slow device, a blocked script or a single runtime error
 * left the whole page blank. A CSS animation starts at parse time, cannot be
 * gated behind hydration, and is disabled for reduced-motion users.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
