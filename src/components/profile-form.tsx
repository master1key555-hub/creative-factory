"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile, updatePassword } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [pwdPending, startPwd] = useTransition();

  function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.ok) setProfileMsg({ ok: true, text: "Profile updated." });
      else setProfileMsg({ ok: false, text: result.error });
    });
  }

  function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwdMsg(null);
    const formData = new FormData(e.currentTarget);
    startPwd(async () => {
      const result = await updatePassword(formData);
      if (result.ok) {
        setPwdMsg({ ok: true, text: "Password updated." });
        (e.target as HTMLFormElement).reset();
      } else {
        setPwdMsg({ ok: false, text: result.error });
      }
    });
  }

  return (
    <div className="space-y-10">
      <form onSubmit={saveProfile} className="space-y-4">
        <h2 className="serif text-xl font-semibold">Profile</h2>
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name || ""}
          />
        </div>
        <div>
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="url"
            placeholder="https://…"
            defaultValue={profile.avatar_url || ""}
          />
        </div>
        {profileMsg && (
          <p
            className={`text-sm ${
              profileMsg.ok ? "text-primary" : "text-destructive"
            }`}
          >
            {profileMsg.text}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save profile"}
        </Button>
      </form>

      <form onSubmit={changePassword} className="space-y-4">
        <h2 className="serif text-xl font-semibold">Change password</h2>
        <div>
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>
        {pwdMsg && (
          <p
            className={`text-sm ${
              pwdMsg.ok ? "text-primary" : "text-destructive"
            }`}
          >
            {pwdMsg.text}
          </p>
        )}
        <Button type="submit" variant="outline" disabled={pwdPending}>
          {pwdPending ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
