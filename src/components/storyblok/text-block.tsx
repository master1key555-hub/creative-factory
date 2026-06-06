import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface TextBlok extends SbBlokData {
  text?: string;
  align?: "left" | "center" | "right";
}

export default function TextBlock({ blok }: { blok: TextBlok }) {
  const align =
    blok.align === "center"
      ? "text-center"
      : blok.align === "right"
        ? "text-right"
        : "text-left";

  return (
    <div
      {...storyblokEditable(blok)}
      className={`mx-auto max-w-3xl px-4 py-6 sm:px-6 ${align}`}
    >
      <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
        {blok.text}
      </p>
    </div>
  );
}
