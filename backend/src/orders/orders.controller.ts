import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('checkout')
    async checkout(
        @Req() req: Request,
        @Body('items') items: { productId: string, quantity: number }[],
        @Body('idempotencyKey') idempotencyKey?: string,
    ) {
        const userId = (req.user as any).sub;
        return this.ordersService.createCheckout(userId, items, idempotencyKey);
    }

    @Get()
    async getMyOrders(@Req() req: Request) {
        const userId = (req.user as any).sub;
        return this.ordersService.getUserOrders(userId);
    }
}
