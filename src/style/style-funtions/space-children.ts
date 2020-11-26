import css from '@styled-system/css';
import { ResponsiveValue, styleFn } from 'styled-system';
import { isDefined } from 'ts-is-present';
import { SpaceValue } from '../theme';
import { getArrayValue } from '../utils';

export interface SpaceChildrenProps {
  spaceChildren?: ResponsiveValue<SpaceValue>;
  spaceHorizontal?: boolean;
}

export const spaceChildren: styleFn = (x) => {
  if (isDefined(x.spaceChildren)) {
    const value = getArrayValue(x.spaceChildren);

    return css({
      '& > *:not(:last-child)': {
        marginRight: x.spaceHorizontal ? value : null,
        marginBottom: !x.spaceHorizontal ? value : null,
      },
    });
  }
};
