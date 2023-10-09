import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { InlineText } from '~/components/typography';
import { space } from '~/style/theme';
import { SeverityIndicator } from './components/severity-indicator';
import { SeverityIndicatorLabel } from './components/severity-indicator-label';
import { SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH } from './constants';
import { getSeverityColor } from './logic/get-severity-color';
import { SeverityLevel } from './types';

interface SeverityIndicatorTileProps {
  description: string;
  label: string;
  level: SeverityLevel;
  title: string | null;
  sourceLabel: string;
  datesLabel: string;
  levelDescription: string;
}

export const SeverityIndicatorTile = ({ description, label, level, title, datesLabel, sourceLabel, levelDescription }: SeverityIndicatorTileProps) => {
  return (
    <Box
      alignItems="flex-start"
      border={`1px solid ${colors.gray3}`}
      borderLeft={`${space[2]} solid ${getSeverityColor(level)}`}
      css={css({ gap: `0 ${space[5]}` })}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      padding={space[4]}
      marginTop={space[4]}
      as="figure"
    >
      <Box flexGrow={1} width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`}>
        {title && <Markdown content={title} />}
        <InlineText>{datesLabel}</InlineText>

        <SeverityIndicatorLabel label={label} level={level} />

        <SeverityIndicator level={level} />
      </Box>

      <Box flexGrow={1} width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`} as="figcaption">
        {description && <Markdown content={description} />}
        <Box display="block" alignItems="center" marginTop={space[3]} css={css({ gap: space[2] })}>
          {levelDescription && <Markdown content={levelDescription} />}
        </Box>
        <Box marginY={space[3]}>
          <InlineText color="gray7">{sourceLabel}</InlineText>
        </Box>
      </Box>
    </Box>
  );
};
