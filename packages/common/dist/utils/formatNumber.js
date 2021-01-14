import { getLocale } from './getLocale';
var locale = getLocale();
var NumberFormat = new Intl.NumberFormat(locale);
export function formatNumber(value) {
    if (typeof value === 'undefined' || value === null)
        return '-';
    return NumberFormat.format(Number(value));
}
export function formatPercentage(value, maximumFractionDigits) {
    if (maximumFractionDigits === void 0) { maximumFractionDigits = 1; }
    return new Intl.NumberFormat(locale, { maximumFractionDigits: maximumFractionDigits }).format(value);
}
//# sourceMappingURL=formatNumber.js.map