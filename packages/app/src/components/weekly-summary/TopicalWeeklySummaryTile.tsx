import css from '@styled-system/css';
import styled from 'styled-components';
import { colors } from '@corona-dashboard/common';
import { fontWeights, space } from '~/style/theme';
import { Markdown } from '~/components/markdown';
import { Box } from '~/components/base';
import { BoldText, InlineText } from '~/components/typography';
import { IconName } from '@corona-dashboard/icons/src/icon-name2filename';
import DynamicIcon from '~/components/get-icon-by-name';
import { SeverityLevel, SeverityLevels } from '../severity-indicator-tile/types';
import { getSeverityColor } from '../severity-indicator-tile/logic/get-severity-color';
import { asResponsiveArray } from '~/style/utils';
import { WEEKLY_SUMMARY_HEAD_TEXT, WEEKLY_SUMMARY_CONTENT } from '../severity-indicator-tile/constants';

interface TopicalWeeklySummaryProps {
  label: string | undefined;
  level: SeverityLevels;
}

export const TopicalWeeklySummaryTile = ({ label, level }: TopicalWeeklySummaryProps) => {
  return (
    <Box px={3} maxWidth={930}>
      <Box border={`1px solid ${colors.gray3}`} p={4} m={asResponsiveArray({ _: undefined, sm: 3 })}>
        <BoldText css={css({ fontSize: [3] })}>
          <Markdown content={WEEKLY_SUMMARY_HEAD_TEXT.text} />
        </BoldText>

        <Box as="ul">
          {WEEKLY_SUMMARY_CONTENT.map((iconText, index) => {
            return (
              <>
                <Box key={index} display="flex" pt={2} css={css({ gap: `0 ${space[3]}` })} alignItems="center" as="li">
                  <Box minWidth={25} height={25}>
                    <DynamicIcon width={25} name={iconText.icon as IconName} />
                  </Box>
                  <Box>
                    <InlineText>{iconText.text}</InlineText>
                    {iconText.isThermometerMetric ? (
                      <InlineText css={css({ whiteSpace: 'nowrap' })}>
                        <SeverityIndicatorLevel level={level}>{level}</SeverityIndicatorLevel>
                        <BoldText>{label}</BoldText>
                      </InlineText>
                    ) : (
                      ''
                    )}
                  </Box>
                </Box>
              </>
            );
          })}
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
