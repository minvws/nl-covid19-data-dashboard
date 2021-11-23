import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';
import { spacing } from '~/style/functions/spacing';
import { styledShouldForwardProp } from '~/lib/styled-should-forward-prop';

export type TileListProps = {
  hasActiveWarningTile?: boolean | string,
  needsMargin?: boolean,
};

export const TileList = styled(Box).withConfig({
  shouldForwardProp: styledShouldForwardProp,
})<TileListProps>(
  ({ hasActiveWarningTile}) => {
    return css({
      pt: hasActiveWarningTile ? 4 : asResponsiveArray({ _: 3, md: 5 }),
      px: asResponsiveArray({ _: 3, sm: 5 }),
    } )
  },
  ({needsMargin}) => {
    return needsMargin ? spacing : undefined;
  },
);
