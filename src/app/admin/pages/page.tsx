import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageForm } from "@/components/admin/page-form";
import type { Page } from "@/lib/types";

export const metadata = { title: "Admin · Pages" };

const PAGE_SLUGS = ["about", "privacy", "terms"];

export default async function AdminPages() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .in("slug", PAGE_SLUGS);

  const bySlug = new Map<string, Page>(
    (data || []).map((p) => [p.slug, p as Page]),
  );

  return (
    <div className="space-y-12">
      <header>
        <h2 className="serif text-2xl font-semibold">Static pages</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit About, Privacy Policy, and Terms of Service. Content is Markdown.
        </p>
      </header>
      {PAGE_SLUGS.map((slug) => (
        <section
          key={slug}
          className="border border-border rounded-lg p-6"
        >
          <h3 className="serif text-xl font-semibold mb-4 capitalize">
            /{slug}
          </h3>
          <PageForm slug={slug} page={bySlug.get(slug)} />
        </section>
      ))}
    </div>
  );
}
