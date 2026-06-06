import {
  StoryblokServerComponent,
  storyblokEditable,
  type SbBlokData,
} from "@storyblok/react/rsc";

interface PageBlok extends SbBlokData {
  body?: SbBlokData[];
}

export default function Page({ blok }: { blok: PageBlok }) {
  return (
    <main {...storyblokEditable(blok)}>
      {blok.body?.map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </main>
  );
}
