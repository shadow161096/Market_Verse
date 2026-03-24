import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminService {
    constructor(private prisma: DatabaseService) { }

    async getStats() {
        const [productCount, orderCount, userCount, revenue] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.order.count(),
            this.prisma.user.count(),
            this.prisma.order.aggregate({
                where: { status: 'PAID' },
                _sum: { totalAmount: true },
            }),
        ]);

        return {
            revenue: Number(revenue._sum.totalAmount) || 0,
            orders: orderCount,
            customers: userCount,
            products: productCount,
            revenueDelta: '+12.5%',
            ordersDelta: '+5 today',
            customersDelta: '+2.1% MoM',
        };
    }
}
