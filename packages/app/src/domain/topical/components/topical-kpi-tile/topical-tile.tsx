import { Box } from '~/components/base';
import theme, { space, fontSizes } from '~/style/theme';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading, InlineText } from '~/components/typography';
import { TextWithIcon } from '~/components/text-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { ChevronRight } from '@corona-dashboard/icons';
import { RichContent } from '~/components/cms/rich-content';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { KpiValue } from '~/components';
import { useIntl } from '~/intl';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';
import { Cta } from '~/queries/query-types';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import { TrendIcon as TrendIconType } from '@corona-dashboard/app/src/domain/topical/types';
import { mapStringToColors } from '~/components/severity-indicator-tile/logic/map-string-to-colors';
import { useTrendIconLookUp } from './logic/use-trend-icon-look-up';

interface TopicalTileProps {
  title: string;
  tileIcon: TopicalIcon;
  trendIcon: TrendIconType;
  description: PortableTextEntry[];
  kpiValue: string | null;
  cta: Cta;
  sourceLabel: string | null;
}

export function TopicalTile({ title, tileIcon, trendIcon, description, kpiValue, cta, sourceLabel }: TopicalTileProps) {
  const { formatNumber } = useIntl();

  const formattedKpiValue = typeof kpiValue === 'number' ? formatNumber(kpiValue) : typeof kpiValue === 'string' ? kpiValue : false;
  const trendIconConfigFromLookup = useTrendIconLookUp(kpiValue); // TrendIconConfig will be null for values between -4.9 - 4.9.
  const finalTrendIconConfig = {
    color: trendIcon.color ? mapStringToColors(trendIcon.color) : trendIconConfigFromLookup?.color,
    direction: trendIcon.direction ? TrendDirection[trendIcon.direction] : trendIconConfigFromLookup?.direction,
    intensity: trendIcon.intensity ? trendIcon.intensity : trendIconConfigFromLookup?.intensity,
  };

  return (
    <Box
      as={cta.href ? 'a' : 'div'}
      href={cta.href ?? undefined}
      borderColor={colors.gray3}
      borderWidth="1px"
      borderStyle="solid"
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      color="black"
      css={css({
        '&:hover .topical-tile-cta': {
          backgroundColor: colors.blue8,
          textDecoration: 'underline',
          color: colors.white,
        },
      })}
    >
      <>
        <Box display="flex" flexDirection="column" justifyContent="start">
          <Box
            display="flex"
            justifyContent="space-between"
            css={css({
              gap: space[2],
            })}
          >
            <Box
              fontSize={{ _: fontSizes[6], xs: fontSizes[7] }}
              paddingLeft={asResponsiveArray({ _: space[3], xs: space[4] })}
              paddingTop={asResponsiveArray({ _: space[3], xs: space[4] })}
            >
              <Heading
                level={3}
                color={colors.blue8}
                css={css({
                  display: 'flex',
                  justifyContent: 'start',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  hyphens: 'auto',
                })}
              >
                {title}
              </Heading>

              {/* When there is a KPI Value AND Trend icon is configured - It shows next to the KPI value */}
              {formattedKpiValue && (
                <Box display="flex" justifyContent="start" alignItems="center" marginTop={space[2]}>
                  <KpiValue color={colors.black} text={formattedKpiValue} />

                  {finalTrendIconConfig && finalTrendIconConfig.direction !== undefined && (
                    <TrendIcon trendDirection={finalTrendIconConfig.direction} color={finalTrendIconConfig.color} intensity={finalTrendIconConfig.intensity} />
                  )}
                </Box>
              )}
            </Box>

            <TileIcon>
              <DynamicIcon name={tileIcon} aria-hidden="true" />
            </TileIcon>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="start"
            textAlign="left"
            padding={{ _: space[3], xs: space[4] }}
            paddingTop={formattedKpiValue ? { _: space[2], xs: space[2] } : undefined}
          >
            <Box display="flex" alignItems="center">
              <RichContent blocks={description} elementAlignment="start" />
            </Box>
          </Box>
        </Box>

        <Box>
          {sourceLabel && (
            <Box padding={{ _: space[3], xs: space[4] }} paddingTop={{ _: '0', xs: '0' }}>
              <InlineText color="gray7">{sourceLabel}</InlineText>
            </Box>
          )}

          {cta.title && (
            <Box display="flex" justifyContent="center" alignItems="center" backgroundColor={colors.blue1} color={colors.blue8} padding={space[3]} className="topical-tile-cta">
              <TextWithIcon text={cta.title} icon={<ChevronRight />} />
            </Box>
          )}
        </Box>
      </>
    </Box>
  );
}

const TileIcon = styled.span`
  background-color: ${colors.blue8};
  border-bottom-left-radius: ${space[1]};
  color: ${colors.white};
  height: 40px;
  padding: ${space[2]};
  width: 40px;

  @media ${theme.mediaQueries.sm} {
    height: 50px;
    width: 50px;
  }
`;
