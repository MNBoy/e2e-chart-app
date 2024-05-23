import { IMessage } from '@/interfaces/IMessage';
import { Tools } from '@/lib/tools';
import { useState } from 'react';
import { io } from 'socket.io-client';

let socket = io('http://localhost:4000');
let key: CryptoKey;

// Handle receiving the encryption key from the server
socket.on('encryption-key', async (receivedKey) => {
  // Convert the received key from base64 string to ArrayBuffer
  const decodedKey = await crypto.subtle.importKey(
    'raw',
    Uint8Array.from(atob(receivedKey), (c) => c.charCodeAt(0)),
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );

  key = decodedKey;
});

const useChatLayout = () => {
  const [messagesState, setMessages] = useState<IMessage[]>([]);

  const sendMessage = async (newMessage: IMessage) => {
    const encryptedData = await Tools.encryptMessage(key, newMessage);
    socket.emit('new-message', {
      iv: Array.from(encryptedData.iv),
      message: Array.from(encryptedData.encryptedMessage),
    });
  };

  return { messagesState, sendMessage };
};

export default useChatLayout;
