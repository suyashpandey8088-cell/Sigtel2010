import fs from "node:fs/promises";
import path from "node:path";
import type { AdminUser, Enquiry, Project } from "@/lib/types";
import type { Store } from "./types";
import { projects as seedProjects } from "@/lib/content/projects";

/**
 * File-backed store — used for local development and any environment where no
 * PostgreSQL connection is configured. Mirrors the PostgreSQL schema in
 * prisma/schema.prisma.
 *
 * Serverless safety: on hosts such as Vercel the only writable directory is
 * /tmp and the deployment directory is read-only, so every filesystem call here
 * is treated as best-effort. Reads fall back to an in-memory snapshot seeded
 * from the published works register; writes update that snapshot and are
 * persisted only when the filesystem actually allows it. This store must never
 * throw — a public page reading the register must not 500 because a disk is
 * read-only.
 */

interface Snapshot {
  projects: Project[];
  enquiries: Enquiry[];
  users: AdminUser[];
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "store.json");

let cache: Snapshot | null = null;
let persistence: "unknown" | "on" | "off" = "unknown";
let warned = false;

const seedSnapshot = (): Snapshot => ({
  projects: seedProjects,
  enquiries: [],
  users: [],
});

function normalise(parsed: Partial<Snapshot> | null): Snapshot {
  return {
    projects: Array.isArray(parsed?.projects) && parsed.projects.length ? parsed.projects : seedProjects,
    enquiries: Array.isArray(parsed?.enquiries) ? parsed.enquiries : [],
    users: Array.isArray(parsed?.users) ? parsed.users : [],
  };
}

function disablePersistence(error: unknown) {
  persistence = "off";
  if (!warned) {
    warned = true;
    console.warn(
      "[store] File store is not writable in this environment; data is held in memory for this instance. Configure DATABASE_URL for durable storage.",
      error instanceof Error ? error.message : error,
    );
  }
}

async function persist(snapshot: Snapshot): Promise<void> {
  if (persistence === "off") return;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(snapshot, null, 2));
    await fs.rename(tmp, FILE);
    persistence = "on";
  } catch (error) {
    disablePersistence(error);
  }
}

async function read(): Promise<Snapshot> {
  if (cache) return cache;

  try {
    const raw = await fs.readFile(FILE, "utf8");
    cache = normalise(JSON.parse(raw) as Partial<Snapshot>);
  } catch (error) {
    cache = seedSnapshot();
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") {
      // Genuinely a first run — try to create the file once.
      await persist(cache);
    } else {
      // EROFS / EACCES / ENOTDIR: the filesystem cannot be written at all.
      disablePersistence(error);
    }
  }

  return cache;
}

async function commit(mutate: (snapshot: Snapshot) => void): Promise<Snapshot> {
  const snapshot = await read();
  mutate(snapshot);
  await persist(snapshot);
  return snapshot;
}

export const jsonStore: Store = {
  async listProjects(includeUnpublished = false) {
    const data = await read();
    return data.projects
      .filter((p) => includeUnpublished || p.published)
      .sort((a, b) => a.order - b.order);
  },

  async getProject(slug) {
    const data = await read();
    return data.projects.find((p) => p.slug === slug) ?? null;
  },

  async createProject(project) {
    await commit((data) => {
      data.projects = data.projects.filter((p) => p.id !== project.id);
      data.projects.push(project);
    });
    return project;
  },

  async updateProject(id, patch) {
    let updated: Project | null = null;
    await commit((data) => {
      const index = data.projects.findIndex((p) => p.id === id);
      if (index === -1) return;
      updated = { ...data.projects[index], ...patch, id };
      data.projects[index] = updated;
    });
    return updated;
  },

  async deleteProject(id) {
    let removed = false;
    await commit((data) => {
      const before = data.projects.length;
      data.projects = data.projects.filter((p) => p.id !== id);
      removed = data.projects.length < before;
    });
    return removed;
  },

  async createEnquiry(enquiry) {
    await commit((data) => {
      data.enquiries = [enquiry, ...data.enquiries];
    });
    return enquiry;
  },

  async listEnquiries() {
    const data = await read();
    return data.enquiries;
  },

  async updateEnquiryStatus(id, status) {
    let updated: Enquiry | null = null;
    await commit((data) => {
      const enquiry = data.enquiries.find((e) => e.id === id);
      if (!enquiry) return;
      enquiry.status = status;
      updated = enquiry;
    });
    return updated;
  },

  async findUserByEmail(email) {
    const data = await read();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  },

  async ensureAdmin(user) {
    await commit((data) => {
      if (data.users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) return;
      data.users.push(user);
    });
  },
};
