import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Classic Edge middleware. Next.js 16 renamed `middleware` to `proxy` (Node
// runtime), but the Cloudflare adapter (@opennextjs/cloudflare) does not yet
// support Node middleware, so we keep the Edge `middleware` convention here.
// `updateSession` only touches cookies via @supabase/ssr, which is Edge-safe.
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
