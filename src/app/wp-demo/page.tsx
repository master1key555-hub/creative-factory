import Link from "next/link";
import type { Metadata } from "next";
import { getHomepage, type HomepageFields } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "WordPress headless demo",
  description:
    "Example page rendering content managed in a headless WordPress site via WPGraphQL + ACF.",
};

/** Turn a YouTube watch/share URL into an embeddable URL. */
function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const id = u.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export default async function WpDemoPage() {
  let fields: HomepageFields | null = null;
  let error: string | null = null;

  try {
    const data = await getHomepage();
    fields = data.page?.homepageFields ?? null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  const embed = fields?.videoUrl ? toYouTubeEmbed(fields.videoUrl) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 sm:py-28">
      <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
        Headless WordPress
      </p>

      {error ? (
        <div className="rounded-md border border-border p-6">
          <h1 className="serif text-2xl font-semibold mb-2">
            WordPress is not connected yet
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Set <code>WORDPRESS_GRAPHQL_URL</code> in your environment, then
            reload. See <code>docs/wordpress-headless.md</code> for setup.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/70 break-words">
            {error}
          </p>
        </div>
      ) : (
        <>
          <h1 className="serif text-4xl sm:text-5xl font-semibold leading-[1.1] max-w-2xl">
            {fields?.heading ?? "Untitled"}
          </h1>

          {embed && (
            <div className="mt-10 aspect-video w-full overflow-hidden rounded-lg border border-border">
              <iframe
                className="h-full w-full"
                src={embed}
                title={fields?.heading ?? "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {fields?.buttonText && fields?.buttonLink && (
            <div className="mt-10">
              <Link
                href={fields.buttonLink}
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {fields.buttonText}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
