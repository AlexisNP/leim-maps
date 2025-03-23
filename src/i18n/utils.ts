import { defaultLang, availableLangs, type Language } from './ui';

/**
 * This function will get the language from the URL
 *
 * @param url The URL to get the language from
 * @returns The language found in the URL, or the default language if not found
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (availableLangs.includes(lang as Language)) return lang as Language;
  return defaultLang
}

/**
 * This function will generate a new URL with the given language
 * It will replace the first part of the path with the new language
 * For example, if the URL is /fr/quests and the new language is 'en', the new URL will be /en/quests
 *
 * @param url The active URL
 * @param lang The target language to generate the new URL
 */
export function switchLang(url: URL, lang: Language): URL {
    const parts = url.pathname.split('/');
    parts[1] = lang;
    return new URL(parts.join('/'), url.origin);
}
