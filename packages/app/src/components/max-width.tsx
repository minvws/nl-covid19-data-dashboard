import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { space } from '~/style/theme';

export const MaxWidth = styled(Box)(
  css({
    maxWidth: 'maxWidth',
    margin: `${space[0]} auto`,
  })
);
