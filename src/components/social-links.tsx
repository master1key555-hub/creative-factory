import {
  InstagramIcon,
  TelegramIcon,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
} from "@/components/brand-icons";
import type { SiteSettings } from "@/lib/types";

interface Props {
  settings: Pick<
    SiteSettings,
    | "instagram_url"
    | "telegram_url"
    | "facebook_url"
    | "twitter_url"
    | "pinterest_url"
  > | null;
  className?: string;
  iconSize?: number;
}

export function SocialLinks({ settings, className = "", iconSize = 18 }: Props) {
  const links = [
    { url: settings?.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { url: settings?.telegram_url, label: "Telegram", Icon: TelegramIcon },
    { url: settings?.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { url: settings?.twitter_url, label: "Twitter", Icon: TwitterIcon },
    { url: settings?.pinterest_url, label: "Pinterest", Icon: PinterestIcon },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map(({ url, label, Icon }) =>
        url && url !== "#" ? (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Icon style={{ width: iconSize, height: iconSize }} />
          </a>
        ) : (
          <span
            key={label}
            aria-label={`${label} (not configured)`}
            className="text-muted-foreground/30"
          >
            <Icon style={{ width: iconSize, height: iconSize }} />
          </span>
        ),
      )}
    </div>
  );
}
