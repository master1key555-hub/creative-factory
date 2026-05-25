import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SubscriberRow } from "@/components/admin/subscriber-row";
import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/lib/types";

export const metadata = { title: "Admin · Subscribers" };

export default async function AdminSubscribers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const subs = (data || []) as Subscriber[];
  const csv =
    "data:text/csv;charset=utf-8," +
    encodeURIComponent(
      ["email,confirmed,created_at", ...subs.map(
        (s) => `${s.email},${s.confirmed},${s.created_at}`,
      )].join("\n"),
    );

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="serif text-2xl font-semibold">Subscribers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {subs.length} total
          </p>
        </div>
        {subs.length > 0 && (
          <a
            href={csv}
            download="subscribers.csv"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted transition-colors"
          >
            Export CSV
          </a>
        )}
      </header>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3 w-40">Subscribed</th>
              <th className="text-right px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subs.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subs.map((s) => (
                <SubscriberRow
                  key={s.id}
                  id={s.id}
                  email={s.email}
                  createdAt={formatDate(s.created_at)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
