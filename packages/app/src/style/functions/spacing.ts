import css from '@styled-system/css';
import { ResponsiveValue, styleFn } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { SpaceValue } from '../theme';
import { asResponsiveArray } from '../utils';

export interface SpacingProps {
  spacing?: ResponsiveValue<SpaceValue>;
  spacingHorizontal?: ResponsiveValue<SpaceValue>;
}

export const spacing: styleFn = (x: SpacingProps) => {
  if (isDefined(x.spacing) || isDefined(x.spacingHorizontal)) {
    return css(spacingStyle(x.spacing, x.spacingHorizontal));
  }
};

export function spacingStyle(
  spacing?: ResponsiveValue<SpaceValue>,
  spacingHorizontal?: ResponsiveValue<SpaceValue>
) {
  return {
    '& > *:not(:last-child)': {
      ...(isDefined(spacingHorizontal) && {
        marginRight: asResponsiveArray(spacingHorizontal),
      }),
      ...(isDefined(spacing) && {
        marginBottom: asResponsiveArray(spacing),
      }),
    },
  };
}
