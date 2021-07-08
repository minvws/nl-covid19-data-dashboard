import css from '@styled-system/css';
import { ResponsiveValue, styleFn } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { SpaceValue } from '../theme';
import { asResponsiveArray } from '../utils';

export interface SpacingProps {
  spacing?: ResponsiveValue<SpaceValue>;
  spacingHorizontal?: boolean;
}

export const spacing: styleFn = (x: SpacingProps) => {
  if (isDefined(x.spacing)) {
    return css(spacingStyle(x.spacing, x.spacingHorizontal));
  }
};

export function spacingStyle(
  spacing: ResponsiveValue<SpaceValue>,
  spacingHorizontal?: boolean
) {
  const value = asResponsiveArray(spacing);

  return {
    '& > *:not(:last-child)': {
      marginRight: spacingHorizontal ? value : null,
      marginBottom: !spacingHorizontal ? value : null,
    },
  };
}
