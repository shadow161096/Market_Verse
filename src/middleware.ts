import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET
);

if (!process.env.JWT_SECRET) {
    // This runs at build/edge startup — fail fast if secret is missing
    console.error("[SECURITY] JWT_SECRET environment variable is not set! Server is insecure.");
}

// ── Public routes (no auth required) ──────────────────────────────────────────
const PUBLIC_PATHS = [
    "/auth/login",
    "/auth/register",
    "/api/auth/login",
    "/api/auth/register",
];

function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// ── In-memory rate limiter for auth routes ─────────────────────────────────
// Limit: 10 requests per 15 minutes per IP on auth endpoints
const authRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = authRateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        authRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }

    if (entry.count >= RATE_LIMIT_MAX) {
        return true;
    }

    entry.count++;
    return false;
}

// ── Middleware ─────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rate-limit auth endpoints to prevent brute force attacks
    if (pathname.startsWith("/api/auth/") && (pathname.includes("login") || pathname.includes("register"))) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            ?? request.headers.get("x-real-ip")
            ?? "unknown";

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please wait 15 minutes before trying again." },
                { status: 429, headers: { "Retry-After": "900" } }
            );
        }
    }

    // Allow public paths
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Check for auth cookie (using access_token from backend)
    const token = request.cookies.get("access_token")?.value;

    if (!token) {
        // If it's an API request, return 401 JSON instead of redirecting
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const loginUrl = new URL("/auth/login", request.url);
        // Prevent infinite redirect loop if already at /auth/login
        if (pathname === "/auth/login") return NextResponse.next();
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify JWT signature and expiry
        const { payload } = await jwtVerify(token, JWT_SECRET!);

        // Add user identity to request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(payload.sub));
        requestHeaders.set("x-user-email", String(payload.email));
        requestHeaders.set("x-user-role", String(payload.role ?? "USER"));

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (error) {
        console.error("[SECURITY] Token validation failed:", error);
        
        // If it's an API request, return 401 JSON instead of redirecting
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized or Expired" }, { status: 401 });
        }

        // Token invalid/expired — clear cookie and redirect
        const loginUrl = new URL("/auth/login", request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
        response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
        return response;
    }
}

export const config = {
    matcher: [
        // Match everything except Next.js internals, static files, and fonts
        "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)",
    ],
};
