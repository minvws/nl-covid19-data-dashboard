import { JSONObject } from './types';

const requiredVariantNames = [
  'alpha',
  'beta',
  'gamma',
  'beta',
  'eta',
  'epsilon',
  'theta',
  'kappa',
  'other',
];

export function validateVariantNames(input: JSONObject) {
  const { variants } = input as Record<
    string,
    Record<string, Record<string, string>[]>
  >;

  if (!variants) {
    return ['No variants key found in NL.json'];
  }

  const variantNames = variants.values.map((x) => x.name.toLocaleLowerCase());

  const errors = requiredVariantNames
    .filter((x) => !variantNames.includes(x))
    .map((x) => `Required variant name ${x} not found in variants collection`);

  return errors.length ? errors : undefined;
}
