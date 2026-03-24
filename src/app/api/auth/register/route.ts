import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password, firstName, lastName } = body;

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
        }

        const res = await fetch(`http://localhost:3001/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                firstName: firstName || username,
                lastName: lastName || ''
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "Registration failed" }, { status: res.status });
        }

        // setAuthCookie now uses 'access_token'
        await setAuthCookie(data.accessToken);

        return NextResponse.json({
            success: true,
            user: data.user
        }, { status: 201 });

    } catch (error) {
        console.error("[Auth] Registration proxy error:", error instanceof Error ? error.message : "Unknown error");
        return NextResponse.json({ error: "Registration service unavailable. Please try again shortly." }, { status: 503 });
    }
}
