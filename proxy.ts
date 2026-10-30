import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/content/projects";

const known = new Set(projects.map((p) => p.slug));

// Case studies stream inside <Suspense>, so a notFound() thrown while rendering
// arrives after a 200 status has been sent. Rejecting unknown slugs here, before
// rendering, gives a real 404 status (and the same not-found page).
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!slug || !known.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/work/:path+",
};
