// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { PasswordData } from './types/passwordType';

contextBridge.exposeInMainWorld('electronAPI', {
    addPassword: (data: PasswordData) =>
        ipcRenderer.invoke('addPassword', data),
    getPasswordsData: () => ipcRenderer.invoke('getPasswordsData'),
    sendRegisterData: (data: {
        email: string;
        username: string;
        password: string;
        password2: string;
    }) => ipcRenderer.invoke('sendRegisterData', data),
    sendLoginData: (data: { username: string; password: string }) =>
        ipcRenderer.invoke('sendLoginData', data),
    logout: () => ipcRenderer.invoke('logout'),
    exportTo: async (passwords: PasswordData[]) =>
        await ipcRenderer.invoke('exportTo', passwords),
    deletePassword: async (id: string) =>
        await ipcRenderer.invoke('deletePassword', id),
});
