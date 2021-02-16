import styled from 'styled-components';
import { Box } from './base';
import { asResponsiveArray } from '~/style/utils';

export const TileList = styled(Box).attrs({
  spacing: 4,
  pt: 4,
  px: asResponsiveArray({ _: 3, sm: 4 }),
})({});
