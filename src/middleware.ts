import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./lib/i18n/middleware";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  return i18n(request);
}

export const config = {
  // Matcher ignoring '/_next' and '/api' and more...
  matcher: ["/((?!_next|api|favicon).*)"],
};
