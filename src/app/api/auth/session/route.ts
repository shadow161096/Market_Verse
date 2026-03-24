import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "super-secure-placeholder-secret-change-in-prod"
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Return decoded token claims — no DB lookup needed, JWT is self-contained
        // sub is the user ID in NestJS JWT
        return NextResponse.json({
            authenticated: true,
            user: {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                username: payload.username, // NestJS often includes this in payload
            },
        });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}

