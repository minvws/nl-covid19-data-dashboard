import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '../typography';

export const Category = styled(Text)(
  css({
    fontSize: 3,
    lineHeight: 1,
    pt: 4,
    px: 3,
    pb: 2,
    m: 0,
    mb: 3,
    fontWeight: 'bold',
  })
);

//    padding: 2rem 1rem .5rem;
