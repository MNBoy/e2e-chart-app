let socket = io('http://localhost:4000');
let key;

// Encrypt message using the current key
async function encryptMessage(message) {
  if (!key) {
    throw new Error('Encryption key is not available.');
  }

  const encoded = new TextEncoder().encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );

  return {
    iv: iv,
    encryptedMessage: new Uint8Array(encrypted),
  };
}

// Decrypt message using the current key
async function decryptMessage(encryptedMessage, iv) {
  if (!key) {
    throw new Error('Decryption key is not available.');
  }

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedMessage
  );

  return new TextDecoder().decode(decrypted);
}

// Handle send message
async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;

  if (message.trim() !== '') {
    const encryptedData = await encryptMessage(message);
    socket.emit('new-message', {
      iv: Array.from(encryptedData.iv),
      message: Array.from(encryptedData.encryptedMessage),
    });

    messageInput.value = '';
  }
}

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

// Handle incoming messages
socket.on('message', async (data) => {
  const iv = new Uint8Array(data.iv);
  const encryptedMessage = new Uint8Array(data.message);
  const decryptedMessage = await decryptMessage(encryptedMessage, iv);

  const messageElement = document.createElement('div');
  messageElement.textContent = `${data.id}: ${decryptedMessage}`;
  document.getElementById('messages').appendChild(messageElement);
});

// Handle user join notification
socket.on('user-joined', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data.message;
  messageElement.classList.add('user-joined');
  document.getElementById('messages').appendChild(messageElement);
});

// Handle user leave notification
socket.on('user-left', (data) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = data.message;
  messageElement.classList.add('user-left');
  document.getElementById('messages').appendChild(messageElement);
});

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
