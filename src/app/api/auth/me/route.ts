import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`http://localhost:3001/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Cookie": `access_token=${token}`
            },
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "Failed to fetch user profile" }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("[Auth] Me API error:", error);
        return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
    }
}
