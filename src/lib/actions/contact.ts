"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

export async function submitContact(formData: FormData): Promise<Result> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const subject = String(formData.get("subject") || "").trim() || null;
  const message = String(formData.get("message") || "").trim();
  if (!name || !email || !message) {
    return { ok: false, error: "Please fill all required fields." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("contact_submissions")
    .insert({ name, email, subject, message });
  if (error) return { ok: false, error: "Could not send. Please try again." };
  return { ok: true };
}
