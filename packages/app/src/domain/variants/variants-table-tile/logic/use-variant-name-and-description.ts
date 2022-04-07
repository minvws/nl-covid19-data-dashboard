import { assert } from '@corona-dashboard/common';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { TableText } from '../types';

export function useVariantNameAndDescription<T extends TableText>(
  variant: keyof T['varianten'],
  otherDescription: string,
  text: T
) {
  const { name, countryOfOrigin } =
    text.varianten[variant as keyof typeof text.varianten];
  const variantDescription =
    variant === 'other_table' ? otherDescription : text.description;

  assert(
    name,
    `[${
      useVariantNameAndDescription.name
    }] No translation found for variant ${String(variant)}`
  );
  assert(
    name,
    `[${
      useVariantNameAndDescription.name
    }] No tooltip found for variant ${String(variant)}`
  );
  assert(
    name,
    `[${
      useVariantNameAndDescription.name
    }] No country of origin found for variant ${String(variant)}`
  );

  return [
    name,
    replaceVariablesInText(variantDescription, {
      variantName: name,
      countryOfOrigin,
    }),
  ] as const;
}
