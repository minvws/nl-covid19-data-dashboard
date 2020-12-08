import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

export const MaxWidth = styled(Box)(
  css({
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 1em',

    '@media (min-width: 1400px)': {
      maxWidth: 1400,
    },
  })
);
