"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import type { Profile, SiteSettings } from "@/lib/types";

interface Props {
  profile: Profile | null;
  settings: SiteSettings;
}

export function MobileNav({ profile, settings }: Props) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="serif text-base font-bold tracking-[0.18em] uppercase">
                {settings.site_name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 text-lg">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="py-3 border-b border-border hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="py-3 border-b border-border hover:text-primary transition-colors"
              >
                Journal
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="py-3 border-b border-border hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="py-3 border-b border-border hover:text-primary transition-colors"
              >
                Contact
              </Link>
              {profile ? (
                <>
                  {profile.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="py-3 border-b border-border hover:text-primary transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="py-3 border-b border-border hover:text-primary transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="py-3 border-b border-border hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="py-3 border-b border-border hover:text-primary transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                Follow
              </p>
              <SocialLinks settings={settings} iconSize={20} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
