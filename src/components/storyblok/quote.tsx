import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface QuoteBlok extends SbBlokData {
  text?: string;
  attribution?: string;
}

export default function Quote({ blok }: { blok: QuoteBlok }) {
  return (
    <figure
      {...storyblokEditable(blok)}
      className="mx-auto max-w-3xl px-4 py-8 sm:px-6"
    >
      <blockquote className="serif border-l-2 border-primary pl-6 text-2xl italic leading-relaxed">
        {blok.text}
      </blockquote>
      {blok.attribution ? (
        <figcaption className="mt-4 pl-6 text-sm uppercase tracking-widest text-muted-foreground">
          {blok.attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}
