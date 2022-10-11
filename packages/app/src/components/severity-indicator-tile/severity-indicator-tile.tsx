import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { space } from '~/style/theme';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { SeverityIndicatorLabel } from './components/severity-indicator-label';
import { SeverityIndicator } from './components/severity-indicator';
import { getSeverityColor } from './logic/get-severity-color';
import { SeverityLevels } from './types';
import { InlineText } from '../typography';
import { SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH } from '~/components/severity-indicator-tile/constants';

interface SeverityIndicatorTileProps {
  description: string;
  label: string;
  level: SeverityLevels;
  footerText: string;
  title: string;
}

export const SeverityIndicatorTile = ({ description, label, level, title, footerText }: SeverityIndicatorTileProps) => {
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
      p={space[4]}
      mt={4}
      as="figure"
    >
      <Box flexGrow={1} width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`}>
        <Markdown content={title} />

        <SeverityIndicatorLabel label={label} level={level} />

        <SeverityIndicator level={level} />
      </Box>

      <Box flexGrow={1} width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`} as="figcaption">
        <Markdown content={description} />
        <Box my={3}>
          <InlineText color="gray7">{footerText}</InlineText>
        </Box>
      </Box>
    </Box>
  );
};
