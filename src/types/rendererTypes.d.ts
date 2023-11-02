import { type PasswordData } from '../types/passwordType';

export interface IElectronAPI {
    addPassword: (data: {
        domain: string;
        email: string;
        password: string;
    }) => Promise<string>;
    getPasswordsData: () => Promise<IPasswordsData>;
    sendRegisterData: (data: {
        email: string;
        username: string;
        password: string;
        password2: string;
    }) => Promise<IRegisterData>;
    sendLoginData: (data: {
        email: string;
        password: string;
    }) => Promise<ILoginData>;
    exportTo: (passwords: PasswordData[]) => Promise<string>;
    deletePassword: (id: string) => Promise<void>;
    logout: () => Promise<void>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
