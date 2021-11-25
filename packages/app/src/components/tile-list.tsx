import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

export const TileList = styled(Box).attrs({ spacing: 5 })<{
  hasActiveWarningTile?: boolean | string;
}>(({ hasActiveWarningTile }) => {
  return css({
    pt: hasActiveWarningTile ? 4 : asResponsiveArray({ _: 3, md: 5 }),
    px: asResponsiveArray({ _: 3, sm: 5 }),
  });
});
