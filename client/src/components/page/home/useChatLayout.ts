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

  const messagesContainer = document.getElementById('messages');
  messagesContainer?.appendChild(messageElement);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
});

// Handle user leave notification
socket.on('user-left', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data.message;
  messageElement.classList.add('text-red-600');

  const messagesContainer = document.getElementById('messages');
  messagesContainer?.appendChild(messageElement);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
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

  const messagesContainer = document.getElementById('messages');
  messagesContainer?.appendChild(messageElement);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
});

socket.on('file', async (data) => {
  const fileData = new Uint8Array(data.file);
  const fileName = data.fileName || 'received_file';
  const fileType = data.fileType || 'application/octet-stream';

  // Create Blob from ArrayBuffer
  const blob = new Blob([fileData], { type: fileType });

  // Create File object from Blob
  const file = new File([blob], fileName);

  // Create download link
  const url = URL.createObjectURL(file);
  const messageElement = document.createElement('a');
  messageElement.href = url;
  messageElement.download = fileName;
  messageElement.textContent = `${data.id} sends a file: ${fileName}`;

  // Add Tailwind CSS classes
  messageElement.classList.add(...'text-cyan-600 underline w-fit'.split(' '));

  // Append download link to messages container
  const messagesContainer = document.getElementById('messages');
  messagesContainer?.appendChild(messageElement);
  messagesContainer?.scrollTo(0, messagesContainer.scrollHeight);
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
      socket.emit('new-file', {
        file: fileData,
        fileName: file.name,
        fileType: file.type,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  return { sendMessage, sendFile };
};

export default useChatLayout;
