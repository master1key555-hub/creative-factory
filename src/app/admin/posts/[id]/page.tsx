import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/admin/post-form";
import type { Post } from "@/lib/types";

export const metadata = { title: "Admin · Edit post" };

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  return (
    <div>
      <header className="mb-6">
        <h2 className="serif text-2xl font-semibold">Edit post</h2>
      </header>
      <PostForm post={data as Post} />
    </div>
  );
}
