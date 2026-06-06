import {
  StoryblokServerComponent,
  storyblokEditable,
  type SbBlokData,
} from "@storyblok/react/rsc";

interface GridBlok extends SbBlokData {
  columns?: SbBlokData[];
}

// Matches Storyblok's standard blueprint "grid" block (a row of cards).
export default function Grid({ blok }: { blok: GridBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-3"
    >
      {blok.columns?.map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </section>
  );
}
