import { IMessage } from '@/interfaces/IMessage';
import { Tools } from '@/lib/tools';
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

// Handle user join notification
socket.on('user-joined', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data.message;
  messageElement.classList.add('text-green-600');
  document.getElementById('messages')?.appendChild(messageElement);
});

// Handle user leave notification
socket.on('user-left', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data.message;
  messageElement.classList.add('text-red-600');
  document.getElementById('messages')?.appendChild(messageElement);
});

socket.on('message', async (data) => {
  const iv = new Uint8Array(data.iv);
  const encryptedMessage = new Uint8Array(data.message);
  const decryptedMessage = await Tools.decryptMessage(
    key,
    encryptedMessage,
    iv
  );

  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.id}: ${decryptedMessage}`;
  document.getElementById('messages')?.appendChild(messageElement);
});

const useChatLayout = () => {
  const sendMessage = async (newMessage: IMessage) => {
    const encryptedData = await Tools.encryptMessage(key, newMessage);
    socket.emit('new-message', {
      iv: Array.from(encryptedData.iv),
      message: Array.from(encryptedData.encryptedMessage),
    });
  };

  const sendFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const fileData = reader.result as ArrayBuffer;
      console.log('🚀 ~ reader.onload= ~ fileData:', fileData);
      const encryptedData = await Tools.encryptMessage(key, {
        message: fileData,
      });
      socket.emit('new-file', {
        iv: Array.from(encryptedData.iv),
        file: Array.from(new Uint8Array(encryptedData.encryptedMessage)),
      });
    };
  };

  return { sendMessage, sendFile };
};

export default useChatLayout;
