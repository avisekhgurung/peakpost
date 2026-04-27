import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from './crypto';

beforeAll(() => {
  if (!process.env.ENCRYPTION_KEY) {
    process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef';
  }
});

describe('crypto', () => {
  it('roundtrips a short string', () => {
    const plain = 'hello world';
    const enc = encrypt(plain);
    expect(enc).not.toBe(plain);
    expect(decrypt(enc)).toBe(plain);
  });

  it('roundtrips a long token-like string', () => {
    const token = 'EAAB' + 'x'.repeat(180);
    expect(decrypt(encrypt(token))).toBe(token);
  });

  it('produces different ciphertexts for the same plaintext (random IV)', () => {
    const a = encrypt('same');
    const b = encrypt('same');
    expect(a).not.toBe(b);
  });

  it('throws on tampered ciphertext', () => {
    const enc = encrypt('secret');
    const buf = Buffer.from(enc, 'base64');
    buf[buf.length - 1] = buf[buf.length - 1] ^ 0xff;
    const bad = buf.toString('base64');
    expect(() => decrypt(bad)).toThrow();
  });
});
