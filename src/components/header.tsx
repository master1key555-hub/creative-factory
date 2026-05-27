import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getCurrentProfile } from "@/lib/auth";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";

export async function Header() {
  const [settings, profile] = await Promise.all([
    getSiteSettings(),
    getCurrentProfile().catch(() => null),
  ]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="serif text-lg font-bold tracking-[0.18em] uppercase">
            {settings.site_name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link href="/" className="link-underline hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/blog" className="link-underline hover:text-primary transition-colors">
            Journal
          </Link>
          <Link href="/about" className="link-underline hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="link-underline hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SocialLinks
            settings={settings}
            className="hidden lg:flex"
            iconSize={16}
          />
          <ThemeToggle />
          {profile ? (
            <div className="hidden md:flex items-center gap-2">
              {profile.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm font-medium px-3 py-2 rounded-md border border-border hover:bg-muted transition-colors"
              >
                {profile.full_name || "Profile"}
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
          <MobileNav profile={profile} settings={settings} />
        </div>
      </div>
    </header>
  );
}
