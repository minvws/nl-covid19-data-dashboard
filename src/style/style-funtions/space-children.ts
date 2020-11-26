import css from '@styled-system/css';
import { ResponsiveValue, styleFn } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { SpaceValue } from '../theme';
import { getArrayValue } from '../utils';

export interface SpaceChildrenProps {
  space?: ResponsiveValue<SpaceValue>;
  spaceHorizontal?: boolean;
}

export const spaceChildren: styleFn = (x: SpaceChildrenProps) => {
  if (isDefined(x.space)) {
    const value = getArrayValue(x.space);

    return css({
      '& > *:not(:last-child)': {
        marginRight: x.spaceHorizontal ? value : null,
        marginBottom: !x.spaceHorizontal ? value : null,
      },
    });
  }
};
