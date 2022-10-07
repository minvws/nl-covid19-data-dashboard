import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { getSeverityColor } from '../logic/get-severity-color';
import { getSeverityHeight } from '../logic/get-severity-height';
import { SeverityLevel, SeverityLevels } from '../types';

interface SeverityIndicatorProps {
  level: SeverityLevel;
}

export const SeverityIndicator = ({ level }: SeverityIndicatorProps) => {
  const severityLevels = Object.entries(SeverityLevels);

  return (
    <Box
      alignItems="flex-end"
      css={css({ gap: `0 ${space[1]}` })}
      display="flex"
      height={space[4]}
      justifyContent="space-between"
      mb={space[4]}
      mt={space[3]}
    >
      {severityLevels.map(([key, value]) => (
        <Box
          key={key}
          backgroundColor={
            level >= value
              ? getSeverityColor(level as SeverityLevels)
              : colors.gray3
          }
          borderRadius={4}
          height={getSeverityHeight(value)}
          position="relative"
          width={`${100 / severityLevels.length}%`}
        >
          {level === value && (
            <Box
              left="50%"
              position="absolute"
              top="100%"
              transform="translateX(-50%)"
            >
              <Box
                borderBottom={`${space[2]} solid ${colors.black}`}
                borderLeft={`${space[1]} solid transparent`}
                borderRight={`${space[1]} solid transparent`}
                m={2}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};
