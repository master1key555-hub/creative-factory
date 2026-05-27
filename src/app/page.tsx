import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import { PostCard } from "@/components/post-card";
import { Hero } from "@/components/hero";
import { FadeUp } from "@/components/motion/fade-up";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { Post } from "@/lib/types";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const [{ data: posts }, settings] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(7),
    getSiteSettings(),
  ]);

  const list = (posts || []) as Post[];
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <div>
      <Hero
        siteName={settings.site_name}
        tagline={settings.tagline || "Where ideas become iconic."}
      />

      {/* Featured + Latest */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
        <FadeUp className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
              Featured
            </p>
            <h2 className="serif text-3xl sm:text-4xl font-semibold">
              The latest essay
            </h2>
          </div>
          <Link
            href="/blog"
            className="link-underline hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors"
          >
            All essays →
          </Link>
        </FadeUp>

        {featured ? (
          <FadeUp delay={0.1}>
            <PostCard post={featured} variant="featured" />
          </FadeUp>
        ) : (
          <p className="text-muted-foreground">
            No essays yet. Check back soon.
          </p>
        )}

        {rest.length > 0 && (
          <>
            <hr className="gold-divider my-16" />
            <FadeUp className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                  Recent
                </p>
                <h2 className="serif text-3xl sm:text-4xl font-semibold">
                  From the archive
                </h2>
              </div>
            </FadeUp>
            <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <StaggerItem key={post.id} className="card-lift">
                  <PostCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </section>
    </div>
  );
}
