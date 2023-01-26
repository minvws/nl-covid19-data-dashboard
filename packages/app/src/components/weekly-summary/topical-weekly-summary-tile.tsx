import css from '@styled-system/css';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { fontWeights, space } from '~/style/theme';
import { Markdown } from '~/components/markdown';
import { Box } from '~/components/base';
import { BoldText, InlineText } from '~/components/typography';
import DynamicIcon from '~/components/get-icon-by-name';
import { SeverityLevel, SeverityLevels } from '../severity-indicator-tile/types';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import { asResponsiveArray } from '~/style/utils';
import { BaseTile } from '~/queries/query-types';
import { getFilenameToIconName } from '~/utils';
import { TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH } from '../severity-indicator-tile/constants';

interface TopicalWeeklySummaryTileProps {
  label: string | undefined;
  level: SeverityLevels;
  title: string;
  summaryItems: BaseTile[];
}

export const TopicalWeeklySummaryTile = ({ label, level, title, summaryItems }: TopicalWeeklySummaryTileProps) => {
  return (
    <Box paddingX={space[3]} maxWidth={TOPICAL_SEVERITY_INDICATOR_TILE_MAX_WIDTH}>
      <Box border={`1px solid ${colors.gray3}`} padding={space[4]} margin={asResponsiveArray({ sm: space[3] })}>
        <BoldText css={css({ fontSize: [3] })}>
          <Markdown content={title} />
        </BoldText>

        <Box as="ul">
          {summaryItems.map((summaryItem, index) => (
            <Box key={index} display="flex" paddingTop={space[2]} css={css({ gap: `0 ${space[3]}` })} alignItems={asResponsiveArray({ sm: 'center' })}>
              <Box minWidth={'25px'} height={'25px'}>
                <DynamicIcon width={'25px'} name={getFilenameToIconName(summaryItem.tileIcon) as TopicalIcon} />
              </Box>
              <Box>
                <InlineText>{summaryItem.description}</InlineText>
                {summaryItem.isThermometerMetric && label && (
                  <InlineText css={css({ whiteSpace: 'nowrap' })}>
                    <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>
                    <BoldText>{label}</BoldText>
                  </InlineText>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const SeverityIndicatorLevel = styled.span`
  margin: 0 ${space[1]};
  background-color: ${({ level }: { level: SeverityLevel }) => getSeverityColor(level as SeverityLevels)};
  border-radius: 50%;
  color: ${colors.white};
  display: inline-block;
  text-align: center;
  font-weight: ${fontWeights.heavy};
  height: 24px;
  width: 24px;
  white-space: nowrap;
`;
