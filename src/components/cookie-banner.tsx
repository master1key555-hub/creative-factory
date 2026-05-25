"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "cf-cookie-consent-v1";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
    JSON.stringify(c),
  )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- reading external localStorage on mount */
  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function save(c: Consent) {
    writeConsent(c);
    setVisible(false);
    setShowSettings(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6 animate-fade-in-up">
      <div className="mx-auto max-w-5xl rounded-lg border border-border bg-card shadow-2xl">
        {!showSettings ? (
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">We use cookies.</span>{" "}
                Essential cookies keep the site running. With your consent we
                also use analytics and marketing cookies to understand and
                improve the experience.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  save({ essential: true, analytics: false, marketing: false })
                }
              >
                Reject non-essential
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  save({ essential: true, analytics: true, marketing: true })
                }
              >
                Accept all
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Cookie preferences</h3>
              <button
                onClick={() => setShowSettings(false)}
                aria-label="Close"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Essential</p>
                  <p className="text-xs text-muted-foreground">
                    Required for the site to function. Always on.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-5 w-5 mt-1 accent-primary"
                  aria-label="Essential cookies (always on)"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Helps us understand how visitors use the site.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="h-5 w-5 mt-1 accent-primary cursor-pointer"
                  aria-label="Analytics cookies"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-xs text-muted-foreground">
                    Used for personalised marketing and ads.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="h-5 w-5 mt-1 accent-primary cursor-pointer"
                  aria-label="Marketing cookies"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  save({ essential: true, analytics: false, marketing: false })
                }
              >
                Reject all non-essential
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  save({ essential: true, analytics, marketing })
                }
              >
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
