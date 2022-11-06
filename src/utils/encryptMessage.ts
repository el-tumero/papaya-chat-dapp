export default async function encryptMessage(key:CryptoKey, encoded:Uint8Array) {
    const iv = Uint8Array.from([30, 101, 166, 160, 141, 236, 60, 68, 112, 204, 81, 64])
    return window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
  }