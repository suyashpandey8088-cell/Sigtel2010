export type Division = "signalling" | "telecom";
export type ProjectStatus = "completed" | "ongoing";

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  division: Division;
  status: ProjectStatus;
  client: string;
  clientDivision?: string;
  location: string;
  state: string;
  year?: string;
  lat: number;
  lng: number;
  summary: string;
  overview: string;
  scope: string[];
  challenges: { title: string; body: string }[];
  approach: { title: string; body: string }[];
  equipment: string[];
  results: string[];
  images: string[];
  featured?: boolean;
  published: boolean;
  order: number;
}

export interface Enquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  category: string;
  location?: string;
  message: string;
  attachment?: string;
  status: "new" | "read" | "responded" | "archived";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
  passwordHash: string;
  createdAt: string;
}
