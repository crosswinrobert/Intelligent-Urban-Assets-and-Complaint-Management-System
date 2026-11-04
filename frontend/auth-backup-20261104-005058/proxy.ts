import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "urban_pulse_session";

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function validSession(token: string): Promise<{ Role: string } | null> {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 64) return null;

    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      new Uint8Array(decodeBase64Url(signature)).buffer,
      new TextEncoder().encode(payload),
    );

    if (!verified) return null;

    const data = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    if (!data.exp || data.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!["Admin", "Citizen", "Staff"].includes(data.Role)) return null;
    return { Role: data.Role };
  } catch {
    return null;
  }
}

function requiredRole(pathname: string): string[] | null {
  if (pathname.startsWith("/admin") ||
      /^\/api\/(dashboard|assets|departments|workers|citizens)(\/|$)/.test(pathname)) {
    return ["Admin"];
  }

  if (pathname.startsWith("/worker")) return ["Staff", "Admin"];
  if (pathname.startsWith("/citizen")) return ["Citizen", "Admin"];

  if (/^\/api\/(assignments|resolutions)(\/|$)/.test(pathname)) {
    return ["Admin", "Staff"];
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await validSession(token) : null;
  const isApi = pathname.startsWith("/api/");

  if (!user) {
    if (isApi) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roles = requiredRole(pathname);
  if (roles && !roles.includes(user.Role)) {
    if (isApi) {
      return NextResponse.json({ success: false, error: "You are not authorized to access this resource." }, { status: 403 });
    }
    const home =
      user.Role === "Admin" ? "/admin/dashboard" :
      user.Role === "Staff" ? "/worker/dashboard" :
      "/citizen/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname === "/") {
    const home =
      user.Role === "Admin" ? "/admin/dashboard" :
      user.Role === "Staff" ? "/worker/dashboard" :
      "/citizen/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

