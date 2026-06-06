import Link from "next/link";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface StoryblokLink {
  url?: string;
  cached_url?: string;
}

interface ButtonBlok extends SbBlokData {
  label?: string;
  link?: StoryblokLink | string;
}

function resolveHref(link: ButtonBlok["link"]): string {
  if (!link) return "#";
  if (typeof link === "string") return link || "#";
  return link.url || link.cached_url || "#";
}

export default function ButtonBlock({ blok }: { blok: ButtonBlok }) {
  const href = resolveHref(blok.link);

  return (
    <div
      {...storyblokEditable(blok)}
      className="mx-auto max-w-4xl px-4 py-6 text-center sm:px-6"
    >
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {blok.label || "Button"}
      </Link>
    </div>
  );
}
