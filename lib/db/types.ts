import type { Enquiry, Project, AdminUser } from "@/lib/types";

export interface Store {
  listProjects(includeUnpublished?: boolean): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  createProject(project: Project): Promise<Project>;
  updateProject(id: string, patch: Partial<Project>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;
  createEnquiry(enquiry: Enquiry): Promise<Enquiry>;
  listEnquiries(): Promise<Enquiry[]>;
  updateEnquiryStatus(id: string, status: Enquiry["status"]): Promise<Enquiry | null>;
  findUserByEmail(email: string): Promise<AdminUser | null>;
  ensureAdmin(user: AdminUser): Promise<void>;
  init?(): Promise<void>;
}
