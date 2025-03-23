import CryptoJS from "crypto-js";

export const decrypt = (encrypted: string) => {
  try {
    const dniDecodificado = decodeURIComponent(encrypted);
    const bytes = CryptoJS.AES.decrypt(dniDecodificado, import.meta.env.VITE_CRYPTO_KEY || '');
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error(e);
    return '';
  }
}

export const encrypt = (text: string) => {
    const dniEncriptado = CryptoJS.AES.encrypt(
        text,
        import.meta.env.VITE_CRYPTO_KEY || '',
    ).toString();
    return encodeURIComponent(dniEncriptado);
}
    