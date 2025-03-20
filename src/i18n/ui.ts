export const availableLangs = ['en', 'fr'] as const;
export type Language = typeof availableLangs[number];

export const defaultLang: Language = 'fr';