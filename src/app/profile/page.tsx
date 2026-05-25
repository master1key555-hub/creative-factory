import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { SignOutButton } from "@/components/sign-out-button";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/profile");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-10">
        <h1 className="serif text-4xl font-semibold mb-2">Your profile</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium">{profile.email}</span>
          {profile.role === "admin" && (
            <span className="ml-2 inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Admin
            </span>
          )}
        </p>
      </header>

      <ProfileForm profile={profile} />

      <hr className="gold-divider my-10" />

      <SignOutButton />
    </div>
  );
}
