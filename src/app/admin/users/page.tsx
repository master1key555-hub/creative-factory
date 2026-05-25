import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRow } from "@/components/admin/user-row";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Admin · Users" };

export default async function AdminUsers() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (data || []) as Profile[];

  return (
    <div>
      <header className="mb-6">
        <h2 className="serif text-2xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {users.length} total
        </p>
      </header>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3 w-32">Role</th>
              <th className="text-left px-4 py-3 w-24">Status</th>
              <th className="text-right px-4 py-3 w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => <UserRow key={u.id} user={u} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
