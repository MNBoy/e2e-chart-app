import { IMessage } from '@/interfaces/IMessage';

export const Tools = {
  // Encrypt message using the current key
  encryptMessage: async function (key: CryptoKey, message: IMessage) {
    if (!key) {
      throw new Error('Encryption key is not available.');
    }

    const encoded = new TextEncoder().encode(message.message);
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
  },

  // Decrypt message using the current key
  decryptMessage: async function (
    key: CryptoKey,
    encryptedMessage: BufferSource,
    iv: BufferSource
  ) {
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
  },
};
