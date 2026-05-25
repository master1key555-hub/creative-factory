import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Mail, Inbox } from "lucide-react";

export const metadata = { title: "Admin · Dashboard" };

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const [posts, users, subs, subms, recentPosts, recentSubms] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("read", false),
    supabase
      .from("posts")
      .select("id, slug, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_submissions")
      .select("id, name, email, subject, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "Posts", value: posts.count ?? 0, href: "/admin/posts", icon: FileText },
    { label: "Users", value: users.count ?? 0, href: "/admin/users", icon: Users },
    { label: "Subscribers", value: subs.count ?? 0, href: "/admin/subscribers", icon: Mail },
    { label: "Unread submissions", value: subms.count ?? 0, href: "/admin/submissions", icon: Inbox },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href}>
            <Card className="hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="serif text-3xl font-semibold mt-2">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="serif text-xl font-semibold">Recent posts</h2>
            <Link
              href="/admin/posts/new"
              className="text-sm font-medium text-primary"
            >
              + New post
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border rounded-lg">
            {(recentPosts.data || []).length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">
                No posts yet.{" "}
                <Link href="/admin/posts/new" className="text-primary underline">
                  Create the first one
                </Link>
                .
              </li>
            ) : (
              (recentPosts.data || []).map((p) => (
                <li key={p.id} className="p-4 flex items-center justify-between">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="text-sm font-medium hover:text-primary truncate"
                  >
                    {p.title}
                  </Link>
                  <span className="text-xs text-muted-foreground capitalize">
                    {p.status}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="serif text-xl font-semibold">Recent submissions</h2>
            <Link
              href="/admin/submissions"
              className="text-sm font-medium text-primary"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border border border-border rounded-lg">
            {(recentSubms.data || []).length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">
                No submissions yet.
              </li>
            ) : (
              (recentSubms.data || []).map((s) => (
                <li key={s.id} className="p-4">
                  <p className="text-sm font-medium">
                    {s.name}{" "}
                    <span className="text-muted-foreground font-normal">
                      · {s.email}
                    </span>
                  </p>
                  {s.subject && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {s.subject}
                    </p>
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
