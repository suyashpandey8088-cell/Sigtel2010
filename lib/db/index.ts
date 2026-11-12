import { jsonStore } from "./json-store";
import { pgStore } from "./pg-store";
import type { Store } from "./types";

let store: Store | null = null;

const READ_TIMEOUT_MS = 9000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`store read timed out after ${ms}ms`)), ms);
    timer.unref?.();
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * Wraps the PostgreSQL store so that a database outage, an unreachable host or a
 * missing table degrades to the bundled works register instead of breaking a
 * page. Reads fall back; writes do not, so a failed enquiry is reported to the
 * visitor rather than silently discarded.
 */
function withFallback(primary: Store, fallback: Store): Store {
  let warned = false;
  // Circuit breaker: after a failure, stop paying the connection timeout on
  // every render and serve bundled content until the cooldown expires.
  let degradedUntil = 0;
  const COOLDOWN_MS = 60_000;
  const warn = (operation: string, error: unknown) => {
    if (warned) return;
    warned = true;
    console.error(
      `[store] ${operation} failed on the configured database; serving bundled content until it recovers.`,
      error instanceof Error ? error.message : error,
    );
  };
  const read = async <T>(operation: string, run: () => Promise<T>, backup: () => Promise<T>): Promise<T> => {
    if (Date.now() < degradedUntil) return backup();
    try {
      const value = await withTimeout(run(), READ_TIMEOUT_MS);
      degradedUntil = 0;
      return value;
    } catch (error) {
      degradedUntil = Date.now() + COOLDOWN_MS;
      warn(operation, error);
      return backup();
    }
  };

  return {
    listProjects: (includeUnpublished) =>
      read("listProjects", () => primary.listProjects(includeUnpublished), () =>
        fallback.listProjects(includeUnpublished),
      ),
    getProject: (slug) => read("getProject", () => primary.getProject(slug), () => fallback.getProject(slug)),
    createProject: (project) => primary.createProject(project),
    updateProject: (id, patch) => primary.updateProject(id, patch),
    deleteProject: (id) => primary.deleteProject(id),
    createEnquiry: (enquiry) => primary.createEnquiry(enquiry),
    listEnquiries: () => primary.listEnquiries(),
    updateEnquiryStatus: (id, status) => primary.updateEnquiryStatus(id, status),
    findUserByEmail: (email) => primary.findUserByEmail(email),
    ensureAdmin: (user) => primary.ensureAdmin(user),
    init: () => primary.init?.() ?? Promise.resolve(),
  };
}

export function getStore(): Store {
  if (!store) {
    store = process.env.DATABASE_URL ? withFallback(pgStore, jsonStore) : jsonStore;
  }
  return store;
}

export const storeDriver = () => (process.env.DATABASE_URL ? "postgresql" : "local-file");
