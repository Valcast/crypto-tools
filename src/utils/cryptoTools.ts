import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import https from 'https'; // Jeśli URL korzysta z protokołu HTTPS
import http from 'http'; // Jeśli URL korzysta z protokołu HTTP

export function encryptText(
    plainText: string,
    keyPath: string,
    forExport?: boolean
) {
    const IV = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        fs.readFileSync(keyPath),
        IV
    );

    const cipherText = Buffer.concat([
        cipher.update(plainText),
        cipher.final(),
        Buffer.from(IV),
    ]);

    return cipherText;
}

export async function decryptText(cipherText: Buffer, keyPath: string) {
    const IV = cipherText.subarray(cipherText.length - 16);

    const encryptedPassword = cipherText.subarray(0, cipherText.length - 16);

    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        fs.readFileSync(keyPath),
        IV
    );

    const plainText = Buffer.concat([
        decipher.update(encryptedPassword),
        decipher.final(),
    ]);

    return plainText.toString();
}

export async function fetchDataFromUrl(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const request = protocol.get(url, response => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                reject(
                    new Error(
                        `Błąd podczas pobierania danych. Kod statusu: ${response.statusCode}`
                    )
                );
                return;
            }

            let data = Buffer.from([]);

            response.on('data', chunk => {
                data = Buffer.concat([data, chunk]);
            });

            response.on('end', () => {
                resolve(data);
            });
        });

        request.on('error', error => {
            reject(error);
        });
    });
}
