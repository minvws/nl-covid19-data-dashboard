import { Box } from './base';
import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';

export const Tile = styled(Box).attrs({ as: 'article' })(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'white',
    p: asResponsiveArray({ _: 3, sm: 4 }),
    borderRadius: 1,
    boxShadow: 'tile',
  })
);
