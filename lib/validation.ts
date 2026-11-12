import { z } from "zod";

export const enquiryCategories = [
  "Electronic Interlocking (EI)",
  "Railway signalling / relay interlocking",
  "IP-MPLS / SDH network",
  "Level-crossing gate",
  "OFC / cable plant",
  "Private siding S&T",
  "CCTV / security",
  "AMC / CAMC",
  "Careers",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a contact number")
    .max(30)
    .regex(/^[+0-9()\s-]+$/, "Use digits, spaces, +, - only"),
  category: z.enum(enquiryCategories, { errorMap: () => ({ message: "Choose an enquiry category" }) }),
  location: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Please add a little more detail (20+ characters)").max(4000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy notice" }) }),
  // spam protection
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  startedAt: z.coerce.number().optional(),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
