import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '../typography';

export const Category = styled(Text)(
  css({
    fontSize: 3,
    lineHeight: 1,
    px: 3,
    pt: 4,
    fontWeight: 'bold',
  })
);
