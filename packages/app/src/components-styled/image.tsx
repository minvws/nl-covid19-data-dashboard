import css from '@styled-system/css';
import styled from 'styled-components/';
import { Box } from '~/components-styled/base';

export const Image = styled(Box).attrs({ as: 'img' })(
  css({
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  })
);
