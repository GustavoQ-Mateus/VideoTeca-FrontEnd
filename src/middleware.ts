import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "vt_token";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/catalogo",
  "/eventos",
  "/sobre",
  "/privacidade",
];

/** Roles allowed per protected area (prefix). */
const AREA_ROLES: [prefix: string, roles: string[]][] = [
  ["/aluno", ["aluno"]],
  ["/professor", ["professor"]],
  ["/funcionario", ["funcionario", "admin"]],
];

type TokenPayload = { sub?: string; role?: string; exp?: number };

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(prefix + "/");

/**
 * Decodes the JWT payload WITHOUT verifying the signature. This is only a UX
 * guard (redirects before rendering); real authorization stays on the API,
 * which validates the signature on every request.
 */
function decodeToken(token: string): TokenPayload | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)),
    );
    const payload = JSON.parse(json);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

function homeFor(role?: string) {
  switch (role) {
    case "professor":
      return "/professor";
    case "funcionario":
    case "admin":
      return "/funcionario";
    default:
      return "/aluno";
  }
}

function toLogin(req: NextRequest) {
  const url = new URL("/login", req.url);
  const { pathname, search } = req.nextUrl;
  url.searchParams.set("next", pathname + search);
  const res = NextResponse.redirect(url);
  if (req.cookies.has(TOKEN_COOKIE)) res.cookies.delete(TOKEN_COOKIE);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    PUBLIC_PATHS.some((p) => matches(pathname, p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return toLogin(req);

  const payload = decodeToken(token);
  if (!payload?.role) return toLogin(req);
  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now())
    return toLogin(req);

  const area = AREA_ROLES.find(([prefix]) => matches(pathname, prefix));
  if (area && !area[1].includes(payload.role)) {
    return NextResponse.redirect(new URL(homeFor(payload.role), req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
