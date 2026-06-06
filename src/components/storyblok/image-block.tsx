import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface StoryblokAsset {
  filename?: string;
  alt?: string;
}

interface ImageBlok extends SbBlokData {
  // A Storyblok "Asset" field resolves to an object; a plain text URL is also
  // supported for convenience.
  image?: StoryblokAsset | string;
  alt?: string;
  caption?: string;
}

function resolveSrc(image: ImageBlok["image"]): string | undefined {
  if (!image) return undefined;
  return typeof image === "string" ? image : image.filename;
}

export default function ImageBlock({ blok }: { blok: ImageBlok }) {
  const src = resolveSrc(blok.image);
  const alt =
    blok.alt ?? (typeof blok.image === "object" ? blok.image.alt : "") ?? "";

  if (!src) {
    return <div {...storyblokEditable(blok)} />;
  }

  return (
    <figure
      {...storyblokEditable(blok)}
      className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
    >
      {/* Plain <img>: Storyblok asset hosts vary by region, so we avoid the
          next/image remote-pattern allowlist here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg"
        loading="lazy"
      />
      {blok.caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {blok.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
