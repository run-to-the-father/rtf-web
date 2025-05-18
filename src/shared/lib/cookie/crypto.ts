import CryptoJS from 'crypto-js';

function encrypt<T>(secretKey: string, data: T): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
}

function decrypt<T>(secretKey: string, value: string): T {
  const bytes = CryptoJS.AES.decrypt(value, secretKey);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedString);
}

export { encrypt, decrypt };
