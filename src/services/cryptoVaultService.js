/**
 * Zero-Trust Cryptographic Vault Service
 * Implements client-side AES-GCM 256-bit encryption with PBKDF2 key derivation (100,000 iterations)
 * using native Web Crypto API (window.crypto.subtle).
 */

const VAULT_STORAGE_PREFIX = 'open_outreach_encrypted_vault_';

// Helper: Convert string to Uint8Array
function strToBuffer(str) {
  return new TextEncoder().encode(str);
}

// Helper: Convert Uint8Array to string
function bufferToStr(buf) {
  return new TextDecoder().decode(buf);
}

// Helper: Convert ArrayBuffer to hex string
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper: Convert hex string to Uint8Array
function hexToBuf(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Derive AES-GCM 256-bit Key from Passphrase and Salt via PBKDF2 (100,000 iterations)
 */
export async function deriveKeyFromPassphrase(passphrase, saltBuffer) {
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    strToBuffer(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a JSON payload string with AES-GCM 256-bit
 */
export async function encryptVaultPayload(payloadObj, passphrase) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const jsonStr = JSON.stringify(payloadObj);
  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    strToBuffer(jsonStr)
  );

  return {
    v: 1,
    salt: bufToHex(salt),
    iv: bufToHex(iv),
    ciphertext: bufToHex(encryptedBuf)
  };
}

/**
 * Decrypt an AES-GCM 256-bit vault payload
 */
export async function decryptVaultPayload(encryptedContainer, passphrase) {
  if (!encryptedContainer || !encryptedContainer.ciphertext) return null;

  const salt = hexToBuf(encryptedContainer.salt);
  const iv = hexToBuf(encryptedContainer.iv);
  const ciphertext = hexToBuf(encryptedContainer.ciphertext);

  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  const jsonStr = bufferToStr(decryptedBuf);
  return JSON.parse(jsonStr);
}

/**
 * Save Encrypted Vault for specific Tenant ID
 */
export function saveEncryptedTenantVault(tenantId, encryptedContainer) {
  try {
    const key = `${VAULT_STORAGE_PREFIX}${tenantId || 'default'}`;
    localStorage.setItem(key, JSON.stringify(encryptedContainer));
  } catch (e) {}
}

/**
 * Load Encrypted Vault for specific Tenant ID
 */
export function loadEncryptedTenantVault(tenantId) {
  try {
    const key = `${VAULT_STORAGE_PREFIX}${tenantId || 'default'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
