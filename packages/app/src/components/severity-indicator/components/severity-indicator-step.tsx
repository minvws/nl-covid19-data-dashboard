import { colors } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { SeverityLevel, SeverityStep, SEVERITY_STEPS } from '../types';

interface SeverityIndicatorStepProps {
  color: string;
  level: SeverityLevel;
  step: SeverityStep;
}

export const SeverityIndicatorStep = ({
  color,
  level,
  step,
}: SeverityIndicatorStepProps) => {
  return (
    <Box
      backgroundColor={step.level <= level ? color : colors.gray3}
      borderRadius={4}
      height={step.height}
      position="relative"
      width={`${100 / SEVERITY_STEPS.length}%`}
    >
      {level === step.level && (
        <Box
          left="50%"
          position="absolute"
          top="100%"
          transform="translate3d(-50%, 0, 0)"
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
  );
};
