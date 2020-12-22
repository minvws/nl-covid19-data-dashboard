export type PluralizationTexts = Record<'zero' | 'singular' | 'plural', string>;

export function getPluralizedText(texts: PluralizationTexts, amount: number): string {
  const absoluteAmount = Math.abs(amount);
  if (absoluteAmount === 0) {
    return texts.zero;
  }
  if (absoluteAmount <= 1) {
    return texts.singular;
  }
  return texts.plural;
}
