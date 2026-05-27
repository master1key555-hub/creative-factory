import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AnimatedWords } from "@/components/motion/animated-words";
import { FadeUp } from "@/components/motion/fade-up";
import type { Metadata } from "next";
import type { Page } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return {
    title: page?.seo_title || page?.title || "About",
    description: page?.seo_description || undefined,
  };
}

async function getPage(): Promise<Page | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", "about")
    .maybeSingle();
  return data as Page | null;
}

export default async function AboutPage() {
  const page = await getPage();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 sm:py-24">
      <h1 className="serif text-5xl sm:text-6xl font-semibold mb-10">
        <AnimatedWords text={page?.title || "About"} />
      </h1>
      <FadeUp delay={0.2}>
        <div className="prose-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page?.content || "_Page content not set._"}
          </ReactMarkdown>
        </div>
      </FadeUp>
    </article>
  );
}
