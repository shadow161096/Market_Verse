import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

interface SessionPayload {
    id: string;
    role: string;
    email: string;
}

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET // No fallback — fails loudly if not configured
);

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signToken(payload: { id: string; role: string }) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            id: payload.sub as string,
            role: payload["role"] as string,
            email: payload["email"] as string
        };
    } catch {
        return null;
    }
}

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
        httpOnly: true,           // Not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "lax",          // lax = protect CSRF, still allow normal nav
        path: "/",
        maxAge: 60 * 15,          // 15 minutes — matches NestJS JWT_EXPIRATION_TIME
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return null;
    return await verifyToken(token);
}
