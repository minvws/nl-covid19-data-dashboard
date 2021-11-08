import { Arrow, Chevron } from '@corona-dashboard/icons';
import styled from 'styled-components';

export const ArrowIconRight = styled(Arrow)`
  transform: rotate(-90deg);
`;

export const ArrowIconLeft = styled(Arrow)`
  transform: rotate(90deg);
`;

export const ArrowIconThinRight = Chevron;

export const ArrowIconThinLeft = styled(Chevron)`
  transform: scaleX(-1);
`;
