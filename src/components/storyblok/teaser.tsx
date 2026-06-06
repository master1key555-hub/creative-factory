import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface TeaserBlok extends SbBlokData {
  headline?: string;
}

// Matches Storyblok's standard blueprint "teaser" block (a headline banner).
export default function Teaser({ blok }: { blok: TeaserBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28"
    >
      <h1 className="serif text-4xl font-semibold sm:text-6xl">
        {blok.headline}
      </h1>
    </section>
  );
}
