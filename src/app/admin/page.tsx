import { api } from "@/lib/api";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
    let stats = {
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0,
        revenueDelta: '0%',
        ordersDelta: '0',
        customersDelta: '0%'
    };

    try {
        stats = await api.get('/admin/stats');
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
    }

    return <AdminClient initialStats={stats} />;
}
