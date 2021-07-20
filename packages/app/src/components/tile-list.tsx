import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

export const TileList = styled(Box).attrs({
  spacing: 4,
  pt: asResponsiveArray({ _: 3, md: 4 }),
  px: asResponsiveArray({ _: 3, sm: 4 }),
})({});
