import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register"],
      // Private areas stay out of search results. Client order links (/o/...) are not
      // blocked here so WhatsApp can show a preview; each one is marked "noindex" instead.
      disallow: ["/admin", "/dashboard", "/clients", "/orders", "/settings", "/blocked"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
