import type { MetadataRoute } from "next";
import { getStore } from "@/lib/db";
import { company } from "@/lib/content/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = company.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/signalling`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/telecommunications`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/infrastructure`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let projects: MetadataRoute.Sitemap = [];
  try {
    const list = await getStore().listProjects();
    projects = list.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    projects = [];
  }

  return [...staticRoutes, ...projects];
}
