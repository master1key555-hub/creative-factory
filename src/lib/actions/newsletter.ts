"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(emailRaw: string): Promise<Result> {
  const email = (emailRaw || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email, confirmed: true });
  if (error) {
    if (error.code === "23505") {
      return { ok: true };
    }
    return { ok: false, error: "Could not subscribe. Please try again." };
  }
  return { ok: true };
}
