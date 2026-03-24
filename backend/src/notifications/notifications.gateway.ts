import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

// Note: In a production environment, you would use a Redis IoAdapter 
// for scaling WebSocket connections across multiple Node instances.
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  // Track connected users (in a real app, bind Socket ID to User ID via Redis)
  private activeDocs: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Authentication validation could go here directly or via IoAdapter
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeDocs.delete(client.id);
  }

  // Example Event: Front-end joins a specific User Room to receive personal alerts
  @SubscribeMessage('joinUserRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(`user_${userId}`);
    this.activeDocs.set(client.id, userId);
    return { event: 'joinedRoom', data: `Successfully joined room for User: ${userId}` };
  }

  // Example Broadcast: System sends an "Order Shipped" notification
  public sendOrderUpdate(userId: string, orderId: string, status: string) {
    this.server.to(`user_${userId}`).emit('orderUpdate', {
      orderId,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}
