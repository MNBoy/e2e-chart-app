import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { INewMessage } from './interfaces';

const socketPort: number = +process.env.SOCKET_PORT || 4000;

@WebSocketGateway(socketPort, {
  cors: '*', // accept origin
})
export class ChatService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Broadcast except client
    client.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: Socket) {
    // Broadcast except client
    client.emit('user-left', {
      message: `User left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('new-message')
  handleNewMessage(@MessageBody() messageObj: INewMessage) {
    // Broadcast message
    this.server.emit('message', messageObj.message);
  }
}
