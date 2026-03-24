import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"; // NestJS app doesn't prefix with /api/v1 for /auth based on main.ts logging vs auth.controller.ts path. Let's check: main.ts says 'http://localhost:${process.env.PORT ?? 3001}/api/v1', actually wait. 
// auth.controller.ts has `@Controller('auth')`. It will be under the global prefix if set, but main.ts does not run `app.setGlobalPrefix('api/v1')`. It just prints it! Let's use http://localhost:3001/auth.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const res = await fetch(`http://localhost:3001/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "Invalid credentials" }, { status: res.status });
        }

        // Store the NestJS JWT token in our Next.js session cookie
        // setAuthCookie now uses 'access_token' internally
        await setAuthCookie(data.accessToken);

        return NextResponse.json({
            success: true,
            user: data.user
        });
    } catch (error) {
        // Log error server-side but never expose internals to the client
        console.error("[Auth] Login proxy error:", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({ error: "Authentication service unavailable. Please try again shortly." }, { status: 503 });
    }
}
