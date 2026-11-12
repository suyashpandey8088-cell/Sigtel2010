import type { MetadataRoute } from "next";
import { company } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  const base = company.siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
