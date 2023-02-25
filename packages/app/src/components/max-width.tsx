import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { sizes } from '~/style/theme';

export const MaxWidth = styled(Box)(
  css({
    maxWidth: sizes.maxWidth,
    margin: '0 auto',
  })
);
