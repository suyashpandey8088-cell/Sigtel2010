import { jsonStore } from "./json-store";
import { pgStore } from "./pg-store";
import type { Store } from "./types";

let store: Store | null = null;

/**
 * Wraps the PostgreSQL store so that a database outage, an unreachable host or a
 * missing table degrades to the bundled works register instead of breaking a
 * page. Reads fall back; writes do not, so a failed enquiry is reported to the
 * visitor rather than silently discarded.
 */
function withFallback(primary: Store, fallback: Store): Store {
  let warned = false;
  const warn = (operation: string, error: unknown) => {
    if (warned) return;
    warned = true;
    console.error(
      `[store] ${operation} failed on the configured database; serving bundled content until it recovers.`,
      error instanceof Error ? error.message : error,
    );
  };
  const read = async <T>(operation: string, run: () => Promise<T>, backup: () => Promise<T>): Promise<T> => {
    try {
      return await run();
    } catch (error) {
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
