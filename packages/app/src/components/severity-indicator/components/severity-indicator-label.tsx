import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { space, fontWeights } from '~/style/theme';
import { Text } from '~/components/typography';
import { SeverityLevel } from '../types';

interface SeverityIndicatorLabelProps {
  color: string;
  label: string;
  level: SeverityLevel;
}

export const SeverityIndicatorLabel = ({
  color,
  label,
  level,
}: SeverityIndicatorLabelProps) => {
  return (
    <>
      <SeverityIndicatorLevel color={color}>{level}</SeverityIndicatorLevel>

      <Text variant="h3">{label}</Text>
    </>
  );
};

const SeverityIndicatorLevel = styled.div`
  align-items: center;
  background-color: ${({ color }: { color: string }) => color};
  border-radius: 50%;
  color: ${colors.white};
  display: flex;
  font-weight: ${fontWeights.heavy};
  height: ${space[4]};
  justify-content: center;
  margin-right: ${space[2]};
  width: ${space[4]};
`;
