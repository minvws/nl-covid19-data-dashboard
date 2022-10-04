import { Box } from '~/components/base';
import theme, { space } from '~/style/theme';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { TextWithIcon } from '~/components/text-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { ChevronRight, Down, Up } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';

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
  cta: Cta | null;
}

export function TopicalTile({
  title,
  tileIcon,
  trendIcon,
  dynamicDescription,
  cta,
}: TopicalTileProps) {
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
            <Box display="block" fontSize={{ _: 6, xs: 7 }}>
              <Heading
                level={3}
                color={colors.blue8}
                css={css({
                  display: 'flex',
                  justifyContent: 'start',
                  paddingLeft: asResponsiveArray({ _: 3, xs: 4 }),
                  paddingRight: 0,
                  paddingTop: asResponsiveArray({ _: 3, xs: 4 }),
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word',
                  hyphens: 'auto',
                })}
              >
                {title}
                {trendIcon && (
                  <TrendIconWrapper color={trendIcon.color}>
                    {trendIcon.direction === 'DOWN' && <Down />}
                    {trendIcon.direction === 'UP' && <Up />}
                  </TrendIconWrapper>
                )}
              </Heading>
            </Box>

            <TileIcon>
              <DynamicIcon name={tileIcon} />
            </TileIcon>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="start"
            textAlign="left"
            p={{ _: 3, xs: 4 }}
          >
            <Box display="flex" alignItems="center">
              <Markdown content={dynamicDescription} />
            </Box>
          </Box>
        </Box>

        {cta && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg={colors.blue1}
            color={colors.blue8}
            padding={3}
            className="topical-tile-cta"
          >
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
  height: 20px;
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
