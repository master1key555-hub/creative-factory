import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  FileEdit,
  Users,
  Mail,
  Inbox,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/pages", label: "Pages", icon: FileEdit },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/admin");
  if (profile.role !== "admin" || profile.banned) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
          Administration
        </p>
        <h1 className="serif text-4xl font-semibold">Studio</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
