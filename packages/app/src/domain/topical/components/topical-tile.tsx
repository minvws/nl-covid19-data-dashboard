import { Box } from '~/components/base';
import theme, { space } from '~/style/theme';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { TextWithIcon } from '~/components/text-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { ChevronRight } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import { KpiValue } from '~/components';
import { useIntl } from '~/intl';
import { TrendDirection, TrendIcon } from '~/components/trend-icon';

type TrendIcon = {
  direction: 'UP' | 'DOWN';
  color: string;
};

type Cta = {
  label: string;
  href: string;
};

interface TopicalTileProps {
  title: string;
  tileIcon: TopicalIcon;
  trendIcon: TrendIcon | null;
  dynamicDescription: string;
  kpiValue: number | null | string;
  cta: Cta | null;
}

export function TopicalTile({ title, tileIcon, trendIcon, dynamicDescription, kpiValue, cta }: TopicalTileProps) {
  const { formatNumber } = useIntl();

  const formattedKpiValue = typeof kpiValue === 'number' ? formatNumber(kpiValue) : typeof kpiValue === 'string' ? kpiValue : false;

  const getTrendDiretion = (trendIcon: TrendIcon): TrendDirection => {
    return trendIcon.direction === 'DOWN' ? TrendDirection.DOWN : TrendDirection.UP;
  };

  return (
    <Box
      as="a"
      href={cta?.href}
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
          bg: colors.blue8,
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
              gap: 2,
            })}
          >
            <Box display="block" fontSize={{ _: 6, xs: 7 }} pl={asResponsiveArray({ _: 3, xs: 4 })} pt={asResponsiveArray({ _: 3, xs: 4 })}>
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
                {!formattedKpiValue && trendIcon && (
                  <TrendIconWrapper color={trendIcon.color}>
                    <TrendIcon trendDirection={getTrendDiretion(trendIcon)} />
                  </TrendIconWrapper>
                )}
              </Heading>
              {formattedKpiValue && (
                <Box display="flex" justifyContent="start" alignItems="center" mt={2}>
                  <KpiValue color={colors.black} text={formattedKpiValue} />
                  {trendIcon && (
                    <TrendIconWrapper color={trendIcon.color}>
                      <TrendIcon trendDirection={getTrendDiretion(trendIcon)} />
                    </TrendIconWrapper>
                  )}
                </Box>
              )}
            </Box>

            <TileIcon>
              <DynamicIcon name={tileIcon} aria-hidden="true" />
            </TileIcon>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="start" textAlign="left" p={{ _: 3, xs: 4 }} pt={formattedKpiValue ? { _: 2, xs: 2 } : undefined}>
            <Box display="flex" alignItems="center">
              <Markdown content={dynamicDescription} />
            </Box>
          </Box>
        </Box>

        {cta && (
          <Box display="flex" justifyContent="center" alignItems="center" bg={colors.blue1} color={colors.blue8} padding={3} className="topical-tile-cta">
            <TextWithIcon text={cta.label} icon={<ChevronRight />} />
          </Box>
        )}
      </>
    </Box>
  );
}

const TrendIconWrapper = styled.span`
  color: ${({ color }) => color};
  flex-shrink: 0;
  margin-left: ${space[2]};
  width: 20px;
`;

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
