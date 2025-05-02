// utils/polyfillCrypto.ts
import * as Random from 'expo-random';

if (typeof global.crypto === 'undefined') {
  global.crypto = {} as any;
}

if (typeof global.crypto.getRandomValues === 'undefined') {
  global.crypto.getRandomValues = (array: Uint8Array) => {
    const randomBytes = Random.getRandomBytes(array.length);
    array.set(randomBytes);
    return array;
  };
}

console.log('[polyfillCrypto] crypto.getRandomValues is defined.');
