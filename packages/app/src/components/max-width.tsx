import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import theme from '~/style/theme';

export const MaxWidth = styled(Box)(
  css({
    maxWidth: theme.sizes.maxWidth,
    margin: '0 auto',
  })
);
