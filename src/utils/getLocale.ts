export function getLocale(): string {
  const locale = process.env.NEXT_PUBLIC_LOCALE;
  const defaultLocale = 'nl';
  if (!locale) return defaultLocale;
  if (locale === 'en') return 'en-GB';
  return locale;
}
