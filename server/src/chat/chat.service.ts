import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as crypto from 'crypto';
import { Server, Socket } from 'socket.io';
import { INewFile, INewMessage } from './interfaces';

const socketPort: number = +process.env.SOCKET_PORT || 4000;

// Generate a random encryption key
const encryptionKey = crypto.randomBytes(32);

@WebSocketGateway(socketPort, {
  cors: '*', // accept origin
})
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Send the key to the client
    client.emit('encryption-key', encryptionKey.toString('base64'));

    // Broadcast except client
    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    // Broadcast event
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('new-message')
  handleNewMessage(client: Socket, message: INewMessage) {
    // Broadcast message
    this.server.emit('message', { ...message, id: client.id });
  }

  @SubscribeMessage('new-file')
  handleNewFile(client: Socket, message: INewFile) {
    // Broadcast message
    this.server.emit('file', { ...message, id: client.id });
  }
}
