import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Admin · Settings" };

export default async function AdminSettings() {
  const settings = await getSiteSettings();
  return (
    <div>
      <header className="mb-6">
        <h2 className="serif text-2xl font-semibold">Site settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Branding, social links, and footer.
        </p>
      </header>
      <SettingsForm settings={settings} />
    </div>
  );
}
