import { css } from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

export const TopicalTile = styled(Box).attrs({ as: 'article' })(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'tileGray',
    padding: 4,
    borderRadius: 1,
  })
);
