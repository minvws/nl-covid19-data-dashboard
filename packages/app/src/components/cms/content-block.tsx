import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

export const ContentBlock = styled(Box)(
  css({
    marginX: 'auto',
    width: '100%',
    maxWidth: 'contentWidth',
    paddingX: space[4],
    /** remove padding of nested ContentBlock instances */
    [`& &`]: { paddingX: '0' },
  })
);
