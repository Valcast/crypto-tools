import { PasswordData } from '../types/passwordType';

export function countDuplicatePasswords(passwords: string[]): number {
    const passwordCountMap = new Set<string>();
    let totalDuplicateOccurences = 0;
    for (const password of passwords) {
        if (passwordCountMap.has(password)) {
            totalDuplicateOccurences++;
        } else {
            passwordCountMap.add(password);
        }
    }
    return totalDuplicateOccurences;
}

export function checkPasswordStrength(password: string): string[] {
    const minLength = 8; // Minimalna długość hasła
    const minUpperCase = 1; // Minimalna liczba wielkich liter
    const minLowerCase = 1; // Minimalna liczba małych liter
    const minNumbers = 1; // Minimalna liczba cyfr
    const minSpecialChars = 1; // Minimalna liczba znaków specjalnych

    const warningMessages: string[] = [];

    // Sprawdzanie minimalnej długości hasła
    if (password.length < minLength) {
        warningMessages.push('Password too short');
    }

    // Sprawdzanie minimalnej liczby wielkich liter
    const upperCaseRegex = /[A-Z]/g;
    if ((password.match(upperCaseRegex) || []).length < minUpperCase) {
        warningMessages.push('Lack of at least one uppercase letter');
    }

    // Sprawdzanie minimalnej liczby małych liter
    const lowerCaseRegex = /[a-z]/g;
    if ((password.match(lowerCaseRegex) || []).length < minLowerCase) {
        warningMessages.push('Lack of at least one lowervase letter');
    }

    // Sprawdzanie minimalnej liczby cyfr
    const numbersRegex = /[0-9]/g;
    if ((password.match(numbersRegex) || []).length < minNumbers) {
        warningMessages.push('Lack of at least one number');
    }

    // Sprawdzanie minimalnej liczby znaków specjalnych
    const specialCharsRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/g;
    if ((password.match(specialCharsRegex) || []).length < minSpecialChars) {
        warningMessages.push('Lack of at least one special character');
    }

    return warningMessages;
}

export function addPasswordWarnings(data: PasswordData[]): void {
    data.forEach(item => {
        const warnings = checkPasswordStrength(item.password);
        item.warnings = warnings.length > 0 ? warnings : [];
    });
}

export function countObjectsWithWarnings(data: PasswordData[]): number {
    let count = 0;
    data.forEach(item => {
        if (item.warnings && item.warnings.length > 0) {
            count++;
        }
    });
    return count;
}

export function filterObjectsByInput(data: PasswordData[], input: string) {
    const filteredObjects = data.filter(
        item => item.domain.includes(input) || item.email.includes(input)
    );

    return filteredObjects;
}

export function markDuplicatePasswords(data: PasswordData[]): void {
    const passwordMap: { [key: string]: string[] } = {}; // Obiekt do śledzenia id powtarzających się haseł

    // Przeszukaj tablicę obiektów i zapisz id powtarzających się haseł w passwordMap
    data.forEach(item => {
        if (item.password in passwordMap) {
            passwordMap[item.password].push(item.id);
        } else {
            passwordMap[item.password] = [item.id];
        }
    });

    // Ustaw pole duplicates na tablicę id dla obiektów, których hasła się powtarzają
    data.forEach(item => {
        if (passwordMap[item.password].length > 1) {
            item.duplicates = passwordMap[item.password].filter(
                id => id !== item.id
            );
        } else {
            item.duplicates = [];
        }
    });
}
