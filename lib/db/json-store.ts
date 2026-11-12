import fs from "node:fs/promises";
import path from "node:path";
import type { AdminUser, Enquiry, Project } from "@/lib/types";
import type { Store } from "./types";
import { projects as seedProjects } from "@/lib/content/projects";

/**
 * File-backed store — used for local development and preview environments where
 * no PostgreSQL connection is configured. Mirrors the PostgreSQL schema in
 * prisma/schema.prisma. Not intended for multi-instance production hosting.
 */

interface Snapshot {
  projects: Project[];
  enquiries: Enquiry[];
  users: AdminUser[];
}

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "store.json");

let queue: Promise<unknown> = Promise.resolve();

function serial<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function read(): Promise<Snapshot> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Snapshot;
    if (!parsed.projects?.length) parsed.projects = seedProjects;
    return parsed;
  } catch {
    const initial: Snapshot = { projects: seedProjects, enquiries: [], users: [] };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

async function write(snapshot: Snapshot): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(snapshot, null, 2));
  await fs.rename(tmp, FILE);
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
    return serial(async () => {
      const data = await read();
      data.projects.push(project);
      await write(data);
      return project;
    });
  },

  async updateProject(id, patch) {
    return serial(async () => {
      const data = await read();
      const index = data.projects.findIndex((p) => p.id === id);
      if (index === -1) return null;
      const next = { ...data.projects[index], ...patch, id };
      data.projects[index] = next;
      await write(data);
      return next;
    });
  },

  async deleteProject(id) {
    return serial(async () => {
      const data = await read();
      const before = data.projects.length;
      data.projects = data.projects.filter((p) => p.id !== id);
      await write(data);
      return data.projects.length < before;
    });
  },

  async createEnquiry(enquiry) {
    return serial(async () => {
      const data = await read();
      data.enquiries.unshift(enquiry);
      await write(data);
      return enquiry;
    });
  },

  async listEnquiries() {
    const data = await read();
    return data.enquiries;
  },

  async updateEnquiryStatus(id, status) {
    return serial(async () => {
      const data = await read();
      const enquiry = data.enquiries.find((e) => e.id === id);
      if (!enquiry) return null;
      enquiry.status = status;
      await write(data);
      return enquiry;
    });
  },

  async findUserByEmail(email) {
    const data = await read();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  },

  async ensureAdmin(user) {
    return serial(async () => {
      const data = await read();
      if (data.users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) return;
      data.users.push(user);
      await write(data);
    });
  },
};
