import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

async function siteOrigin() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  const staticUrls: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${origin}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "published");
    const postUrls: MetadataRoute.Sitemap = (data || []).map((p) => ({
      url: `${origin}/blog/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    return [...staticUrls, ...postUrls];
  } catch {
    return staticUrls;
  }
}
