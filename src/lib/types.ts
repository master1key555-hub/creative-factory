export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  tags: string[];
  status: PostStatus;
  author_id: string | null;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  banned: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
  name?: string | null;
  tag?: string | null;
  source?: string | null;
  page_url?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  default_og_image: string | null;
  footer_text: string | null;
  instagram_url: string | null;
  telegram_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  pinterest_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  updated_at: string;
}
