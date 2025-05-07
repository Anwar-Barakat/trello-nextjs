import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

const isPublicApiRoute = createRouteMatcher([
  "/api/webhook(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();
  const currentUrl = new URL(req.url);
  const isHomePage = currentUrl.pathname === "/";

  if (userId && isHomePage) {
    return NextResponse.redirect(new URL("/organization", req.url));
  }

  if (userId && !orgId && currentUrl.pathname.startsWith("/organization")) {
    return NextResponse.redirect(new URL("/select-org", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
