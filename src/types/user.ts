// ─── User Domain Types ────────────────────────────────────────────────────────

export interface Address {
    id: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

export interface Order {
    id: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    itemCount: number;
    trackingNumber?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    phone?: string;
    address?: string; // Storing as string for simplicity in current store, can expand later
    role: "USER" | "ADMIN";
    accountStatus: "ACTIVE" | "SUSPENDED";
    lastLogin?: string;
    createdAt: string;
}
