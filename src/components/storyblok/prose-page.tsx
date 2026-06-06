import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";

interface ProsePageBlok extends SbBlokData {
  title?: string;
  body?: string;
}

// Mirrors the static content pages (about / privacy / terms): a serif heading
// followed by Markdown rendered with the site's `prose-content` styles.
export default function ProsePage({ blok }: { blok: ProsePageBlok }) {
  return (
    <article
      {...storyblokEditable(blok)}
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24"
    >
      {blok.title ? (
        <h1 className="serif text-5xl sm:text-6xl font-semibold mb-10">
          {blok.title}
        </h1>
      ) : null}
      <div className="prose-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blok.body || "_Page content not set._"}
        </ReactMarkdown>
      </div>
    </article>
  );
}
