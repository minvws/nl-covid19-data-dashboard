import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { space } from '~/style/theme';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { Text } from '~/components/typography';
import { Metadata, MetadataProps } from '~/components/metadata';
import { SeverityIndicatorLabel } from './components/severity-indicator-label';
import { SeverityIndicatorStep } from './components/severity-indicator-step';
import { SeverityLevel, SEVERITY_COLORS, SEVERITY_STEPS } from './types';

interface SeverityIndicatorProps {
  description: string;
  label: string;
  level: SeverityLevel;
  metadata: MetadataProps;
  title: string;
}

export const SeverityIndicator = ({
  description,
  label,
  level,
  metadata,
  title,
}: SeverityIndicatorProps) => {
  const color = SEVERITY_COLORS[level - 1];

  return (
    <Box
      alignItems="flex-start"
      border={`1px solid ${colors.gray3}`}
      borderLeft={`${space[2]} solid ${color}`}
      css={css({ gap: `0 ${space[4]}` })}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      p={4}
    >
      <Box
        flexGrow={1}
        minWidth="250px"
        position="relative"
        width="min(50%, 250px)"
      >
        <Text>{title}</Text>

        <Box
          alignItems="center"
          display="flex"
          justifyContent="flex-start"
          my={3}
        >
          <SeverityIndicatorLabel color={color} label={label} level={level} />
        </Box>

        <Box
          alignItems="flex-end"
          display="flex"
          css={css({ gap: `0 ${space[1]}` })}
          height={space[4]}
          justifyContent="space-between"
          mt={3}
          mb={4}
          position="relative"
        >
          {SEVERITY_STEPS.map((step, index) => (
            <SeverityIndicatorStep
              key={index}
              color={color}
              step={step}
              level={level}
            />
          ))}
        </Box>
      </Box>

      <Box flexGrow={1} minWidth="250px" width="min(50%, 250px)">
        <Markdown content={description} />

        <Metadata {...metadata} isTileFooter />
      </Box>
    </Box>
  );
};
