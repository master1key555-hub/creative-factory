import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Posts" };

export default async function AdminPosts() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, status, published_at, created_at, view_count")
    .order("created_at", { ascending: false });

  return (
    <div>
      <header className="mb-6 flex items-center justify-between gap-4">
        <h2 className="serif text-2xl font-semibold">Posts</h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + New post
        </Link>
      </header>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3 w-24">Status</th>
              <th className="text-left px-4 py-3 w-32">Date</th>
              <th className="text-right px-4 py-3 w-20">Views</th>
              <th className="text-right px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(posts || []).length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No posts yet.
                </td>
              </tr>
            ) : (
              (posts || []).map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        p.status === "published"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(p.published_at || p.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {p.view_count}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/posts/${p.id}`}
                      className="text-primary text-xs font-medium mr-3 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="text-muted-foreground text-xs hover:text-foreground"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
