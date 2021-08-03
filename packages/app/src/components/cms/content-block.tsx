import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';

export const ContentBlock = styled(Box)(
  css({
    mx: 'auto',
    maxWidth: 'contentWidth',
    px: 4,
    /** remove padding of nested ContentBlock instances */
    [`& &`]: { px: 0 },
  })
);
