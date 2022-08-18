import { Arrow, ChevronRight } from '@corona-dashboard/icons';
import styled from 'styled-components';

export const ArrowIconRight = styled(Arrow)`
  transform: rotate(-90deg);
`;

export const ArrowIconLeft = styled(Arrow)`
  transform: rotate(90deg);
`;

export const ArrowIconThinRight = ChevronRight;

export const ArrowIconThinLeft = styled(ChevronRight)`
  transform: scaleX(-1);
`;
