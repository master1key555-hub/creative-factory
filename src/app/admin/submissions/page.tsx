import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SubmissionItem } from "@/components/admin/submission-item";
import type { ContactSubmission } from "@/lib/types";

export const metadata = { title: "Admin · Submissions" };

export default async function AdminSubmissions() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const list = (data || []) as ContactSubmission[];

  return (
    <div>
      <header className="mb-6">
        <h2 className="serif text-2xl font-semibold">Contact submissions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {list.length} total · {list.filter((s) => !s.read).length} unread
        </p>
      </header>
      {list.length === 0 ? (
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((s) => (
            <SubmissionItem key={s.id} submission={s} />
          ))}
        </ul>
      )}
    </div>
  );
}
