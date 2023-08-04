import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

export async function decrypted(password: string) {
  const [iv, encryptedPassword] = password.split('-');
  console.log(iv, password);
  const passwordGenerateKey = 'Nest';

  const key: Buffer = (await promisify(scrypt)(
    passwordGenerateKey,
    'salt',
    32,
  )) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex'));

  const decryptedPassword = Buffer.concat([
    decipher.update(Buffer.from(encryptedPassword, 'hex')),
    decipher.final(),
  ]);

  return `${decryptedPassword.toString('hex')}`;
}
