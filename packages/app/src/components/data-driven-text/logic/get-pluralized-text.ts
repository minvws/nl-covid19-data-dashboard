export type PluralizationTexts = Record<'zero' | 'singular' | 'plural', string>;

export function getPluralizedText(
  texts: PluralizationTexts,
  count: number
): string {
  const absoluteCount = Math.abs(count);
  if (absoluteCount === 0) {
    return texts.zero;
  }
  if (absoluteCount <= 1) {
    return texts.singular;
  }
  return texts.plural;
}
