/**
 * Returns the locale, based on NEXT_PUBLIC_LOCALE
 */
export function getLocale() {
    var locale = process.env.NEXT_PUBLIC_LOCALE;
    var defaultLocale = 'nl';
    if (!locale)
        return defaultLocale;
    if (locale === 'en')
        return 'en-GB';
    return locale;
}
//# sourceMappingURL=getLocale.js.map