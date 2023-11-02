export interface PasswordData {
    password: string;
    id: string;
    email: string;
    domain: string;
    warnings?: string[];
    duplicates?: string[];
    iv?: string;
}
