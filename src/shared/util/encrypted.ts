import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export async function encrypted(password: string, keyIv?: string) {
  const iv = Buffer.from(keyIv, 'hex') ?? randomBytes(16);

  const passwordGenerateKey = 'Nest';

  const key = (await promisify(scrypt)(
    passwordGenerateKey,
    'salt',
    32,
  )) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedPassword = Buffer.concat([
    cipher.update(password),
    cipher.final(),
  ]);

  return `${iv.toString('hex')}-${encryptedPassword.toString('hex')}`;
}
