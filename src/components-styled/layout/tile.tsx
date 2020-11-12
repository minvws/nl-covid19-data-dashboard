import { Box } from '../base';
import { css } from '@styled-system/css';
import styled from 'styled-components';

export const Tile = styled(Box).attrs({ as: 'article' })(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'white',
    p: 4,
    pb: 3,
    borderRadius: 1,
    boxShadow: 'tile',
  })
);
