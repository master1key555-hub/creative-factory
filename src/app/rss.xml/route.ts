import { createSupabaseServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { getSiteSettings } from "@/lib/settings";

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const origin = `${proto}://${host}`;
  const settings = await getSiteSettings();
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (posts || [])
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${origin}/blog/${p.slug}</link>
      <guid>${origin}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.published_at || Date.now()).toUTCString()}</pubDate>
      <description>${escape(p.excerpt || "")}</description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escape(settings.site_name)}</title>
    <link>${origin}</link>
    <description>${escape(settings.tagline || "")}</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
