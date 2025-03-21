import { translations, type Language } from './ui';
import { persistentAtom } from '@nanostores/persistent';

export const currentLang = persistentAtom<Language>('lang', "fr");

export function setLang(lang: Language) {
    currentLang.set(lang);
}

export function t(key: string, lang: Language = currentLang.get()): string {
    return translations[lang][key]
}
