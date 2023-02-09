import css from '@styled-system/css';
import styled from 'styled-components';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

export const TileList = styled(Box).attrs({ spacing: 5 })<{
  hasActiveWarningTile?: boolean | string;
}>(({ hasActiveWarningTile }) => {
  return css({
    paddingTop: hasActiveWarningTile ? space[4] : asResponsiveArray({ _: space[3], md: space[5] }),
    paddingX: asResponsiveArray({ _: space[3], sm: space[5] }),
  });
});
