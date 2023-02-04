import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { space, fontWeights } from '~/style/theme';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { getSeverityColor } from '../logic/get-severity-color';
import { SeverityLevel, SeverityLevels } from '../types';

interface SeverityIndicatorLabelProps {
  label: string;
  level: SeverityLevel;
}

export const SeverityIndicatorLabel = ({ label, level }: SeverityIndicatorLabelProps) => {
  return (
    <Box alignItems="center" display="flex" justifyContent="flex-start" marginY={space[3]} css={css({ gap: `0 ${space[2]}` })}>
      <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>

      <Text variant="h3">{label}</Text>
    </Box>
  );
};

export const SeverityIndicatorLevel = styled.div`
  align-items: center;
  background-color: ${({ level }: { level: SeverityLevel }) => getSeverityColor(level as SeverityLevels)};
  border-radius: 50%;
  color: ${colors.white};
  display: flex;
  font-weight: ${fontWeights.heavy};
  height: ${space[4]};
  justify-content: center;
  width: ${space[4]};
`;
