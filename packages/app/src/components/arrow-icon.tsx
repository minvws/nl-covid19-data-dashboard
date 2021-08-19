import styled from 'styled-components';
import { ReactComponent as ArrowIcon } from '~/assets/arrow.svg';

export const ArrowIconRight = styled(ArrowIcon)`
  transform: rotate(-90deg);
`;

export const ArrowIconLeft = styled(ArrowIcon)`
  transform: rotate(90deg);
`;
