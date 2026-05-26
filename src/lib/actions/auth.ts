"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Result = { ok: true } | { ok: false; error: string };

async function siteUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function signUpWithPassword(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  if (!email || !password) return { ok: false, error: "Email and password are required." };
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = await createSupabaseServerClient();
  const base = await siteUrl();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || email.split("@")[0] },
      emailRedirectTo: `${base}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signInWithPassword(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { ok: false, error: "Email and password are required." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signInWithGoogleAction(): Promise<Result | void> {
  const supabase = await createSupabaseServerClient();
  const base = await siteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${base}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: error.message };
  if (data?.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Email is required." };
  const supabase = await createSupabaseServerClient();
  const base = await siteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/callback?next=/reset-password`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updatePassword(formData: FormData): Promise<Result> {
  const password = String(formData.get("password") || "");
  if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateProfile(formData: FormData): Promise<Result> {
  const fullName = String(formData.get("full_name") || "").trim();
  const avatarUrl = String(formData.get("avatar_url") || "").trim();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { ok: true };
}
