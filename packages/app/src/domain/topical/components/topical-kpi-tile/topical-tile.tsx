import { TrendIcon as TrendIconType, TrendIconColor, TrendIconDirection } from '@corona-dashboard/app/src/domain/topical/types';
import { colors } from '@corona-dashboard/common';
import { ChevronRight } from '@corona-dashboard/icons';
import { IconName as TopicalIcon } from '@corona-dashboard/icons/src/icon-name2filename';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import styled from 'styled-components';
import { KpiValue } from '~/components';
import { Box } from '~/components/base';
import { RichContent } from '~/components/cms/rich-content';
import DynamicIcon from '~/components/get-icon-by-name';
import { mapStringToColors } from '~/components/severity-indicator-tile/logic/map-string-to-colors';
import { TextWithIcon } from '~/components/text-with-icon';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';
import { Heading, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Cta } from '~/queries/query-types';
import { fontSizes, mediaQueries, space } from '~/style/theme';
import { Link } from '~/utils/link';
import { getTrendIconLookUp } from './logic/get-trend-icon-look-up';

interface TopicalTileProps {
  cta: Cta;
  description: PortableTextEntry[];
  hideTrendIcon: boolean;
  kpiValue: string | null;
  sourceLabel?: string;
  dateLabel?: string;
  tileIcon: TopicalIcon;
  title: string;
  trendIcon: TrendIconType;
}

export const TopicalTile = ({ title, tileIcon, trendIcon, description, kpiValue, cta, sourceLabel, dateLabel, hideTrendIcon }: TopicalTileProps) => {
  const { formatNumber } = useIntl();

  const formattedKpiValue = typeof kpiValue === 'number' ? formatNumber(kpiValue) : typeof kpiValue === 'string' ? kpiValue : false;
  const hasManualTrendIconConfig = Object.values(trendIcon).every((trendIconValue) => trendIconValue !== null);
  const trendIconConfig = {
    ...(!hasManualTrendIconConfig && kpiValue && getTrendIconLookUp(kpiValue)),
    ...(hasManualTrendIconConfig && {
      ...trendIcon,
      color: mapStringToColors(trendIcon.color as TrendIconColor),
      direction: TrendDirection[trendIcon.direction as TrendIconDirection],
    }),
  };

  return (
    <TopicalTileWrapper cta={cta}>
      <Box display="flex" flexDirection="column" justifyContent="start" flexGrow={1}>
        <Box display="flex" justifyContent="space-between">
          <Box fontSize={{ _: fontSizes[6], xs: fontSizes[7] }} paddingLeft={{ _: space[3], xs: space[4] }} paddingTop={{ _: space[3], xs: space[4] }}>
            <StyledHeading level={3} color={colors.blue8}>
              {title}
            </StyledHeading>

            {formattedKpiValue && (
              <Box display="flex" justifyContent="start" alignItems="center" marginTop={space[2]}>
                <KpiValue color={colors.black} text={formattedKpiValue} />

                {trendIconConfig && trendIconConfig.direction !== undefined && !hideTrendIcon && (
                  <TrendIcon trendDirection={trendIconConfig.direction} color={trendIconConfig.color} intensity={trendIconConfig.intensity} />
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
          paddingTop={formattedKpiValue ? { _: space[2] } : undefined}
        >
          <RichContent blocks={description} elementAlignment="start" variableValue={formattedKpiValue} />
        </Box>
      </Box>

      {dateLabel && (
        <Box padding={{ _: `0 ${space[3]} ${space[1]}`, xs: `0 ${space[4]} ${space[1]}` }}>
          <InlineText color={colors.gray7}>{dateLabel}</InlineText>
        </Box>
      )}

      {sourceLabel && (
        <Box padding={{ _: `0 ${space[3]} ${space[3]}`, xs: `0 ${space[4]} ${space[4]}` }}>
          <InlineText color={colors.gray7}>{sourceLabel}</InlineText>
        </Box>
      )}

      {cta.title && (
        <Box display="flex" justifyContent="center" alignItems="center" backgroundColor={colors.blue1} color={colors.blue8} padding={space[3]} className="topical-tile-cta">
          <TextWithIcon text={cta.title} icon={<ChevronRight />} />
        </Box>
      )}
    </TopicalTileWrapper>
  );
};

interface TopicalTileWrapperProps {
  children: React.ReactNode;
  cta: Cta;
}

const TopicalTileWrapper = ({ cta, children }: TopicalTileWrapperProps) => {
  return cta.href ? (
    <Link href={cta.href} passHref>
      <Tile as="a">{children}</Tile>
    </Link>
  ) : (
    <Tile>{children}</Tile>
  );
};

const TileIcon = styled.span`
  background-color: ${colors.blue8};
  border-bottom-left-radius: ${space[1]};
  color: ${colors.white};
  height: 40px;
  padding: ${space[2]};
  width: 40px;

  @media ${mediaQueries.sm} {
    height: 50px;
    width: 50px;
  }
`;

const Tile = styled(Box)`
  border: 1px solid ${colors.gray3};
  color: ${colors.black};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  &:hover .topical-tile-cta {
    background-color: ${colors.blue8};
    color: ${colors.white};
    text-decoration: underline;
  }
`;

const StyledHeading = styled(Heading)`
  display: flex;
  hyphens: auto;
  justify-content: start;
  margin-right: ${space[2]};
  overflow-wrap: break-word;
  word-wrap: break-word;
`;
