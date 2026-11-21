import type { MetadataRoute } from "next";
import { categories, site } from "@/lib/data";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    ...categories.map((c) => ({ url: `${site.url}/category/${c.slug}/` })),
    ...getAllPosts().map((p) => ({ url: `${site.url}/posts/${p.slug}/`, lastModified: p.date })),
  ];
}
