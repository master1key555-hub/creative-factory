import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { SocialLinks } from "@/components/social-links";
import { NewsletterForm } from "@/components/newsletter-form";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="serif text-lg font-bold tracking-[0.18em] uppercase mb-3">
              {settings.site_name}
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {settings.tagline}
            </p>
            <div className="mt-6">
              <SocialLinks settings={settings} iconSize={18} />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              The Newsletter
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Essays, studio notes, and occasional dispatches. No spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <hr className="gold-divider my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{settings.footer_text}</p>
          <p>
            Crafted with care. Built on Next.js + Supabase.
          </p>
        </div>
      </div>
    </footer>
  );
}
