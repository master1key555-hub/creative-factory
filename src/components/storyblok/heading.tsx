import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface HeadingBlok extends SbBlokData {
  text?: string;
  level?: "h2" | "h3" | "h4";
  align?: "left" | "center" | "right";
}

// A standalone section heading (separate from the big centered `hero`).
export default function Heading({ blok }: { blok: HeadingBlok }) {
  const align =
    blok.align === "center"
      ? "text-center"
      : blok.align === "right"
        ? "text-right"
        : "text-left";

  const Tag = blok.level === "h3" ? "h3" : blok.level === "h4" ? "h4" : "h2";
  const size =
    blok.level === "h4"
      ? "text-xl sm:text-2xl"
      : blok.level === "h3"
        ? "text-2xl sm:text-3xl"
        : "text-3xl sm:text-4xl";

  return (
    <div
      {...storyblokEditable(blok)}
      className={`mx-auto max-w-3xl px-4 py-4 sm:px-6 ${align}`}
    >
      <Tag className={`serif font-semibold ${size}`}>{blok.text}</Tag>
    </div>
  );
}
