import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '../typography';

export const Category = styled(Text)(
  css({
    fontSize: 3,
    lineHeight: 1,
    px: 3,
    mb: 3,
    fontWeight: 'bold',
  })
);
