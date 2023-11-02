import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import {
    createCipheriv,
    createSecretKey,
    randomBytes,
    scryptSync,
} from 'crypto';
import PocketBase from 'pocketbase';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import {
    encryptText,
    decryptText,
    fetchDataFromUrl,
} from './utils/cryptoTools';
import buffer from 'buffer';
import { PasswordData } from './types/passwordType';

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

const TEMP_PATH = app.getPath('temp');
const APPDATA_PATH = app.getPath('appData');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1024,
        minWidth: 900,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        );
    }

    mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('ready', () => {
    if (!existsSync(path.join(__dirname, '../../keys'))) {
        mkdirSync(path.join(__dirname, '../../keys'));
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        pb.authStore.clear();
        rmSync(path.join(TEMP_PATH, 'key.bin'));
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle(
    'addPassword',
    async (
        e: Electron.IpcMainInvokeEvent,
        data: { password: string; email: string; domain: string }
    ) => {
        try {
            const encryptedPassword = encryptText(
                data.password,
                path.join(TEMP_PATH, 'key.bin')
            );

            await pb.collection('passwords').create({
                userID: pb.authStore.model.id,
                email: data.email,
                domain: data.domain.toLowerCase(),
                password: new buffer.File([encryptedPassword], 'password.bin'),
            });

            return true;
        } catch (error) {
            console.log(error);
        }
    }
);

ipcMain.handle('getPasswordsData', async () => {
    try {
        const records = await pb.collection('passwords').getFullList({
            filter: `userID = "${pb.authStore.model.id}"`,
        });

        const fileToken = await pb.files.getToken();

        const results = [];

        for (const record of records) {
            const url = pb.files.getUrl(record, record.password, {
                token: fileToken,
            });

            const buffer = await fetchDataFromUrl(url);

            const decryptedPassword = await decryptText(
                buffer,
                path.join(TEMP_PATH, 'key.bin')
            );

            results.push({
                id: record.id,
                domain: record.domain,
                email: record.email,
                password: decryptedPassword,
            });
        }

        return results;
    } catch (error) {
        console.log(error);
    }
});

ipcMain.handle('sendRegisterData', async (e, data) => {
    if (data.password !== data.password2) {
        return 'Passwords do not match';
    }

    if (data.username.length < 4) {
        return 'Username must be at least 4 characters long';
    }

    if (data.password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    try {
        const salt = randomBytes(16);

        await pb.collection('users').create({
            email: data.email,
            username: data.username,
            emailVisibility: true,
            password: data.password,
            passwordConfirm: data.password2,
            salt: new buffer.File([salt], 'salt.bin'),
        });

        return true;
    } catch (error) {
        console.log(error);
    }
});

ipcMain.handle(
    'sendLoginData',
    async (
        e: Electron.IpcMainInvokeEvent,
        data: { email: string; password: string }
    ) => {
        try {
            const result = await pb
                .collection('users')
                .authWithPassword(data.email, data.password.normalize());

            const fileToken = await pb.files.getToken();

            const url = pb.files.getUrl(result.record, result.record.salt, {
                token: fileToken,
            });

            const salt = await fetchDataFromUrl(url);

            const key = scryptSync(data.password.normalize(), salt, 32);

            const keyObject = createSecretKey(key);

            writeFileSync(path.join(TEMP_PATH, 'key.bin'), keyObject.export());

            return true;
        } catch (error) {
            return false;
        }
    }
);

ipcMain.handle('exportTo', async (e, passwords) => {
    try {
        const salt = randomBytes(16);

        const key = scryptSync(pb.authStore.model.password, salt, 32);

        const encryptedPasswords: PasswordData[] = [];

        for (const password of passwords) {
            const iv = randomBytes(16);

            const cipher = createCipheriv('aes-256-cbc', key, iv);
            const encryptedPassword = Buffer.concat([
                cipher.update(password.password),
                cipher.final(),
                iv,
            ]);

            encryptedPasswords.push({
                domain: password.domain,
                email: password.email,
                password: encryptedPassword.toString('hex'),
            } as PasswordData);
        }

        dialog
            .showSaveDialog(BrowserWindow.getFocusedWindow(), {
                title: 'Export passwords',
                defaultPath: path.join(app.getPath('desktop'), 'passwords.csv'),
                filters: [
                    { name: 'JSON', extensions: ['json'] },
                    { name: 'CSV', extensions: ['csv'] },
                ],
            })
            .then(result => {
                if (result.canceled) {
                    return;
                }

                if (result.filePath) {
                    writeFileSync(
                        result.filePath + '.key',
                        Buffer.concat([key, salt])
                    );
                    if (result.filePath.endsWith('.csv')) {
                        const csv = encryptedPasswords
                            .map(
                                password =>
                                    `${password.domain},${password.email},${password.password}`
                            )
                            .join('\n');

                        writeFileSync(result.filePath, csv);
                    } else if (result.filePath.endsWith('.json')) {
                        writeFileSync(
                            result.filePath,
                            JSON.stringify(encryptedPasswords)
                        );
                    }
                }
            });
    } catch (error) {
        console.log(error);
    }
});

ipcMain.handle('logout', async () => {
    try {
        pb.authStore.clear();
        rmSync(path.join(TEMP_PATH, 'key.bin'));
    } catch (error) {
        console.log(error);
    }
});

ipcMain.handle('deletePassword', async (e, id) => {
    try {
        await pb.collection('passwords').delete(id);
    } catch (error) {
        console.log(error);
    }
});
