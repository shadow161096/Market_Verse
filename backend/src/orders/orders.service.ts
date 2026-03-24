import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
    constructor(private db: DatabaseService) { }

    async createCheckout(userId: string, items: { productId: string, quantity: number }[], idempotencyKey?: string) {
        if (!items.length) {
            throw new BadRequestException('Cart is empty');
        }

        const validIdempotencyKey = idempotencyKey || randomUUID();

        // Check if idempotency key already exists to prevent duplicate charges
        const existingOrder = await this.db.order.findUnique({
            where: { idempotencyKey: validIdempotencyKey },
            include: { items: true }
        });

        if (existingOrder) {
            return existingOrder;
        }

        // We use Prisma's interactive transaction to lock rows and deduct inventory safely
        try {
            const order = await this.db.$transaction(async (tx) => {
                const productIds = items.map(i => i.productId);

                // 1. Fetch products (Ideally we would use Raw SQL for SELECT FOR UPDATE here, 
                // but Prisma $transaction provides basic isolation. For high-currency we use Raw)
                // Using Raw Query for TRUE Row-Level Locking to prevent race conditions overselling:
                const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
                const lockedProducts: any[] = await tx.$queryRawUnsafe(
                    `SELECT id, "stockQuantity", price FROM "Product" WHERE id IN (${placeholders}) FOR UPDATE`,
                    ...productIds
                );

                if (lockedProducts.length !== productIds.length) {
                    throw new NotFoundException('One or more products not found');
                }

                let totalAmount = 0;
                const orderItemsData = [];

                // 2. Compute totals and check stock
                for (const item of items) {
                    const product = lockedProducts.find(p => p.id === item.productId);
                    if (product.stockQuantity < item.quantity) {
                        throw new BadRequestException(`Insufficient stock for product ID: ${product.id}`);
                    }

                    totalAmount += (Number(product.price) * item.quantity);

                    orderItemsData.push({
                        productId: product.id,
                        quantity: item.quantity,
                        lockedPrice: product.price,
                    });
                }

                // 3. Deduct inventory (Native db CHECK constraints will also safeguard us)
                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stockQuantity: { decrement: item.quantity } }
                    });
                }

                // 4. Create Order & Items
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        totalAmount,
                        idempotencyKey: validIdempotencyKey,
                        status: 'PENDING',
                        items: {
                            create: orderItemsData
                        }
                    },
                    include: { items: true }
                });

                return newOrder;
            });

            return order;

        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Checkout Transaction Failed:', error);
            throw new InternalServerErrorException('Checkout failed. Please try again.');
        }
    }

    async getUserOrders(userId: string) {
        return this.db.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: { include: { product: true } } }
        });
    }
}
