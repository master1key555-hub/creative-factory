"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

type Result = { ok: true } | { ok: false; error: string };

export async function setUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserBanned(
  userId: string,
  banned: boolean,
): Promise<Result> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ banned })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function markSubmissionRead(id: string, read: boolean) {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("contact_submissions")
    .update({ read })
    .eq("id", id);
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string) {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const supabase = await createSupabaseServerClient();
  await supabase.from("contact_submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
}

export async function deleteSubscriber(id: string) {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const supabase = await createSupabaseServerClient();
  await supabase.from("subscribers").delete().eq("id", id);
  revalidatePath("/admin/subscribers");
}
