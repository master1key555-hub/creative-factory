import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next || "/profile");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="serif text-4xl font-semibold mb-2 text-center">
        Welcome back
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Log in to comment, like, and manage your profile.
      </p>
      <LoginForm next={next} />
      <p className="mt-6 text-sm text-center text-muted-foreground">
        No account?{" "}
        <Link href="/register" className="text-primary underline underline-offset-4">
          Create one
        </Link>
      </p>
      <p className="mt-2 text-sm text-center">
        <Link
          href="/forgot-password"
          className="text-muted-foreground hover:text-primary underline underline-offset-4"
        >
          Forgot password?
        </Link>
      </p>
    </div>
  );
}
