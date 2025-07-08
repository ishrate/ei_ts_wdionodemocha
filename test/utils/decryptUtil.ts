import crypto from 'crypto';

export function decryptSecret(encrypted: string, secret: string): string {
    const [ivBase64, encryptedData] = encrypted.split(':');
    if (!ivBase64 || !encryptedData) {
        throw new Error('Invalid encrypted value format');
    }
    const iv = Buffer.from(ivBase64, 'base64');
    const key = crypto.createHash('sha256').update(secret).digest();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
