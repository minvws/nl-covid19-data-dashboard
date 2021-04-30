export type SupportedLanguageId = 'nl' | 'en';

export type SupportedLanguage = {
  id: SupportedLanguageId;
  title: string;
  isDefault?: boolean;
};

export const supportedLanguages: SupportedLanguage[] = [
  { id: 'nl', title: 'Nederlands', isDefault: true },
  { id: 'en', title: 'Engels' },
];
