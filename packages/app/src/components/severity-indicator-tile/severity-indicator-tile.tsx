import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { space } from '~/style/theme';
import { Box } from '~/components/base';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { SeverityIndicatorLabel } from './components/severity-indicator-label';
import { SeverityIndicator } from './components/severity-indicator';
import { getSeverityColor } from './logic/get-severity-color';
import { SeverityLevel, SeverityLevels } from './types';

interface SeverityIndicatorTileProps {
  description: string;
  label: string;
  level: SeverityLevel;
  metadata: MetadataProps;
  title: string;
}

export const SeverityIndicatorTile = ({
  description,
  label,
  level,
  metadata,
  title,
}: SeverityIndicatorTileProps) => {
  const SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH = 250;

  return (
    <Box
      alignItems="flex-start"
      border={`1px solid ${colors.gray3}`}
      borderLeft={`${space[2]} solid ${getSeverityColor(
        level as SeverityLevels
      )}`}
      css={css({ gap: `0 ${space[4]}` })}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="space-between"
      p={space[4]}
      as="figure"
    >
      <Box
        flexGrow={1}
        width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`}
      >
        <Markdown content={title} />

        <SeverityIndicatorLabel label={label} level={level} />

        <SeverityIndicator level={level} />
      </Box>

      <Box
        flexGrow={1}
        width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`}
        as="figcaption"
      >
        <Markdown content={description} />

        <Metadata {...metadata} isTileFooter />
      </Box>
    </Box>
  );
};
