import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';

export const MaxWidth = styled(Box)(
  css({
    maxWidth: 1400,
    margin: '0 auto',
  })
);
