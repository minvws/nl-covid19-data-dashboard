import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { getSeverityColor } from '../logic/get-severity-color';
import { getSeverityHeight } from '../logic/get-severity-height';
import { SeverityLevel, SeverityLevels } from '../types';
import { SEVERITY_LEVELS_LIST } from '../constants';

interface SeverityIndicatorProps {
  level: SeverityLevel;
}

const SeverityIndicatorArrow = () => (
  <Box left="50%" position="absolute" top="100%" transform="translateX(-50%)">
    <Box borderBottom={`${space[2]} solid ${colors.black}`} borderLeft={`${space[2]} solid transparent`} borderRight={`${space[2]} solid transparent`} margin={space[2]} />
  </Box>
);

export const SeverityIndicator = ({ level }: SeverityIndicatorProps) => {
  return (
    <Box alignItems="flex-end" css={css({ gap: `0 ${space[1]}` })} display="flex" height={space[4]} marginBottom={space[4]} marginTop={space[3]}>
      {SEVERITY_LEVELS_LIST.map((value, index) => (
        <Box
          key={index}
          backgroundColor={level >= value ? getSeverityColor(level as SeverityLevels) : colors.gray3}
          borderRadius={4}
          height={`${getSeverityHeight(value as SeverityLevel)}%`}
          position="relative"
          width={`${100 / SEVERITY_LEVELS_LIST.length}%`}
        >
          {level === value && <SeverityIndicatorArrow />}
        </Box>
      ))}
    </Box>
  );
};
