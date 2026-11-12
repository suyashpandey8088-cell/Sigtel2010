import { z } from "zod";

export const projectUpsertSchema = z.object({
  title: z.string().trim().min(4).max(300),
  shortTitle: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  division: z.enum(["signalling", "telecom"]),
  status: z.enum(["completed", "ongoing"]),
  client: z.string().trim().min(1).max(160),
  clientDivision: z.string().trim().max(160).optional().or(z.literal("")),
  location: z.string().trim().min(1).max(160),
  state: z.string().trim().min(1).max(120),
  year: z.string().trim().max(20).optional().or(z.literal("")),
  lat: z.coerce.number().min(6).max(38),
  lng: z.coerce.number().min(66).max(98),
  summary: z.string().trim().min(20).max(600),
  overview: z.string().trim().min(20).max(4000),
  scope: z.string().trim().min(2),
  challenges: z.string().trim().optional().or(z.literal("")),
  approach: z.string().trim().optional().or(z.literal("")),
  equipment: z.string().trim().optional().or(z.literal("")),
  results: z.string().trim().optional().or(z.literal("")),
  images: z.string().trim().min(1),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
  order: z.coerce.number().int().min(0).max(999).optional(),
});

export type ProjectUpsertInput = z.infer<typeof projectUpsertSchema>;
