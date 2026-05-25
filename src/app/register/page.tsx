import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Sign up",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/profile");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="serif text-4xl font-semibold mb-2 text-center">
        Join Creative Factory
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Create an account to comment, like essays, and get the newsletter.
      </p>
      <RegisterForm />
      <p className="mt-6 text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline underline-offset-4">
          Log in
        </Link>
      </p>
      <p className="mt-6 text-xs text-center text-muted-foreground">
        By signing up you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
