"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(emailRaw: string): Promise<Result> {
  const email = (emailRaw || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
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

export type LeadInput = {
  email: string;
  name?: string;
  tag?: string;
  source?: string;
  page_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

function clean(v?: string): string | undefined {
  const t = (v || "").trim();
  return t ? t.slice(0, 300) : undefined;
}

// Stores a lead from a signup_form block, recording where it came from.
// The metadata columns are added by migration 002; if that migration has not
// been applied yet, we fall back to inserting just the email so the form keeps
// working (a Postgres "undefined column" is code 42703; PostgREST surfaces a
// missing column in its schema cache as PGRST204).
export async function submitLead(input: LeadInput): Promise<Result> {
  const email = (input.email || "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }

  const supabase = await createSupabaseServerClient();
  const row = {
    email,
    confirmed: true,
    name: clean(input.name),
    tag: clean(input.tag),
    source: clean(input.source),
    page_url: clean(input.page_url),
    utm_source: clean(input.utm_source),
    utm_medium: clean(input.utm_medium),
    utm_campaign: clean(input.utm_campaign),
  };

  const { error } = await supabase.from("subscribers").insert(row);
  if (!error) return { ok: true };
  if (error.code === "23505") return { ok: true };

  if (error.code === "42703" || error.code === "PGRST204") {
    const retry = await supabase
      .from("subscribers")
      .insert({ email, confirmed: true });
    if (!retry.error || retry.error.code === "23505") return { ok: true };
  }

  return { ok: false, error: "Could not submit. Please try again." };
}
