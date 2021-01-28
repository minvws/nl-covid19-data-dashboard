import { css } from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { asResponsiveArray } from '~/style/utils';

export const TopicalTile = styled(Box).attrs({ as: 'article' })(
  css({
    display: 'flex',
    flexDirection: 'column',
    bg: 'tileGray',
    p: 4,
    mx: asResponsiveArray({ _: -3, md: 0 }),
    mb: 0,
    borderRadius: 1,
  })
);
