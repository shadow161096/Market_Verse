import { Injectable, RawBodyRequest, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import Stripe from 'stripe';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private db: DatabaseService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-02-24' as any,
    });
  }

  async createPaymentIntent(orderId: string) {
    const order = await this.db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Order is already processed');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalAmount) * 100), // Stripe uses cents
        currency: 'usd',
        metadata: { orderId: order.id },
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe Payment Intent Error:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async handleStripeWebhook(req: RawBodyRequest<Request>, signature: string) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      if (!req.rawBody) {
        throw new Error('Raw body not found');
      }
      event = this.stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret!);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;
        if (orderId) {
          await this.markOrderAsPaid(orderId);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  private async markOrderAsPaid(orderId: string) {
    await this.db.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (order && order.status === 'PENDING') {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
        // Note: BullMQ job for order success would be triggered here
      }
    });
  }
}
