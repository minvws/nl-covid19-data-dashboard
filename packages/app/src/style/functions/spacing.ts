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
    const value = asResponsiveArray(x.spacing);

    return css({
      '& > *:not(:last-child)': {
        marginRight: x.spacingHorizontal ? value : null,
        marginBottom: !x.spacingHorizontal ? value : null,
      },
    });
  }
};
