import type { Project } from "@/lib/types";

export function toProject(data: import("@/lib/project-schema").ProjectUpsertInput, id: string): Project {
  const lines = (value?: string) =>
    (value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const pairs = (value?: string) =>
    lines(value).map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title.trim(), body: rest.join("|").trim() };
    }).filter((item) => item.title && item.body);

  return {
    id,
    slug: data.slug,
    title: data.title,
    shortTitle: data.shortTitle,
    division: data.division,
    status: data.status,
    client: data.client,
    clientDivision: data.clientDivision || undefined,
    location: data.location,
    state: data.state,
    year: data.year || undefined,
    lat: data.lat,
    lng: data.lng,
    summary: data.summary,
    overview: data.overview,
    scope: lines(data.scope),
    challenges: pairs(data.challenges),
    approach: pairs(data.approach),
    equipment: lines(data.equipment),
    results: lines(data.results),
    images: lines(data.images),
    featured: Boolean(data.featured),
    published: data.published === undefined ? true : Boolean(data.published),
    order: data.order ?? 99,
  };
}

