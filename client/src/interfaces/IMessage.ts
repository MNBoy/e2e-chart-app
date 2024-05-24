export interface IMessage {
  key?: CryptoKey;
  iv?: BufferSource;
  message: string | ArrayBuffer;
}
