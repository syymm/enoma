import { ja } from './ja';
import { zh } from './zh';

export type Locale = 'ja' | 'zh';

const translations = {
  ja,
  zh
};

export function useTranslation(locale: Locale = 'ja') {
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: unknown = translations[locale];
      
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      
      return (value as string) || key;
    },
    locale
  };
}

export { ja, zh };