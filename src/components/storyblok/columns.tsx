import {
  StoryblokServerComponent,
  storyblokEditable,
  type SbBlokData,
} from "@storyblok/react/rsc";

interface ColumnsBlok extends SbBlokData {
  columns?: SbBlokData[];
}

export default function Columns({ blok }: { blok: ColumnsBlok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2"
    >
      {blok.columns?.map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </section>
  );
}
