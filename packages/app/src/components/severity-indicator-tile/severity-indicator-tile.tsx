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
import { BoldText } from '~/components/typography';
import { Down, Up } from '@corona-dashboard/icons';
import styled from 'styled-components';
import { TrendIcon } from '~/domain/topical/types';

interface SeverityIndicatorTileProps {
  description: string;
  label: string;
  level: SeverityLevels;
  title: string;
  dates_label: string;
  source_label: string;
  level_description: string;
  trend_icon: TrendIcon | null;
}

export const SeverityIndicatorTile = ({ description, label, level, title, dates_label, source_label, level_description, trend_icon }: SeverityIndicatorTileProps) => {
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
        <BoldText>
          <Markdown content={title} />
        </BoldText>
        <InlineText>{dates_label}</InlineText>

        <SeverityIndicatorLabel label={label} level={level} />

        <SeverityIndicator level={level} />
      </Box>

      <Box flexGrow={1} width={`min(${SEVERITY_INDICATOR_TILE_COLUMN_MIN_WIDTH}px, 50%)`} as="figcaption">
        <Markdown content={description} />
        <Box
          display="flex"
          alignItems="center"
          mt={3}
          css={css({
            gap: 2,
          })}
        >
          {trend_icon && (
            <TrendIconWrapper color={trend_icon.color}>
              {trend_icon.direction === 'DOWN' && <Down />}
              {trend_icon.direction === 'UP' && <Up />}
            </TrendIconWrapper>
          )}

          <Markdown content={level_description} />
        </Box>
        <Box my={3}>
          <InlineText color="gray7">{source_label}</InlineText>
        </Box>
      </Box>
    </Box>
  );
};

const TrendIconWrapper = styled.span`
  color: ${({ color }) => color};
  flex-shrink: 0;
  width: 20px;
`;
