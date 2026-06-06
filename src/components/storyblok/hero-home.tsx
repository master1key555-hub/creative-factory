import Link from "next/link";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface StoryblokLink {
  url?: string;
  cached_url?: string;
}

interface HeroHomeBlok extends SbBlokData {
  eyebrow?: string;
  headline?: string;
  subheading?: string;
  primary_label?: string;
  primary_link?: StoryblokLink | string;
  secondary_label?: string;
  secondary_link?: StoryblokLink | string;
}

function resolveHref(link: HeroHomeBlok["primary_link"]): string {
  if (!link) return "#";
  if (typeof link === "string") return link || "#";
  return link.url || link.cached_url || "#";
}

// Mirrors the homepage hero (src/app/page.tsx) so it renders identically while
// being editable in the Storyblok Visual Editor.
export default function HeroHome({ blok }: { blok: HeroHomeBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="relative border-b border-border"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 sm:py-28 md:py-36">
        {blok.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">
            {blok.eyebrow}
          </p>
        ) : null}
        {blok.headline ? (
          <h1 className="serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] max-w-4xl">
            {blok.headline}
          </h1>
        ) : null}
        {blok.subheading ? (
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {blok.subheading}
          </p>
        ) : null}
        {blok.primary_label || blok.secondary_label ? (
          <div className="mt-10 flex flex-wrap gap-4">
            {blok.primary_label ? (
              <Link
                href={resolveHref(blok.primary_link)}
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {blok.primary_label}
              </Link>
            ) : null}
            {blok.secondary_label ? (
              <Link
                href={resolveHref(blok.secondary_link)}
                className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium hover:bg-muted transition-colors"
              >
                {blok.secondary_label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
