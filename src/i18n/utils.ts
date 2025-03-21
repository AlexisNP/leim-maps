import { defaultLang, availableLangs, type Language, type LanguageDict } from './ui';

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (availableLangs.includes(lang as Language)) return lang as Language;
  return defaultLang
}
