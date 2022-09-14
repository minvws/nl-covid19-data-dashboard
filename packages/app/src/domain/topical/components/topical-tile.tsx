import { Box } from '~/components/base';
import { space } from '~/style/theme';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { TextWithChevron } from './text-with-chevron';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { Down, Up } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';

interface IconWrapperProps {
  iconColor: string;
}

type TrendIcon = {
  direction: 'UP' | 'DOWN';
  color: string;
} | null;

type Cta = {
  label: string;
  href: string;
} | null;

interface TopicalTileProps {
  title: string;
  tileIcon: TopicalIcon;
  trendIcon?: TrendIcon;
  dynamicDescription: string;
  cta?: Cta;
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
      flexDirection={'column'}
      justifyContent={'space-between'}
      color="#000000"
      css={css({
        '&:hover .topical-tile-cta': {
          bg: colors.blue,
          textDecoration: 'underline',
          color: colors.white,
        },
      })}
    >
      <>
        <Box display="flex" flexDirection={'column'} justifyContent={'start'}>
          <Box
            display="flex"
            justifyContent={'space-between'}
            css={css({
              gap: 2,
            })}
          >
            <Box display="block" fontSize={{ _: 6, xs: 7 }}>
              <Heading
                level={3}
                color={colors.blue}
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
                  <IconWrapper iconColor={trendIcon.color}>
                    {trendIcon.direction === 'DOWN' && <Down />}
                    {trendIcon.direction === 'UP' && <Up />}
                  </IconWrapper>
                )}
              </Heading>
            </Box>

            <KpiIcon>
              <DynamicIcon name={tileIcon} />
            </KpiIcon>
          </Box>
          <Box
            display="flex"
            flexDirection={'column'}
            justifyContent={'start'}
            textAlign={'left'}
            p={{ _: 3, xs: 4 }}
          >
            <Box display="flex" alignItems={'center'}>
              <Markdown content={dynamicDescription} />
            </Box>
          </Box>
        </Box>

        {cta && <TextWithChevron label={cta.label}></TextWithChevron>}
      </>
    </Box>
  );
}

const IconWrapper = styled.span<IconWrapperProps>((x) =>
  css({
    color: x.iconColor,
    flexShrink: 0,
    width: '20px',
    height: '20px',
    marginLeft: 2,
  })
);

const KpiIcon = styled.span(
  css({
    color: colors.white,
    backgroundColor: colors.blue,
    width: asResponsiveArray({ _: 40, sm: 50 }),
    minWidth: asResponsiveArray({ _: 40, sm: 50 }),
    height: asResponsiveArray({ _: 40, sm: 50 }),
    padding: 2,
    borderBottomLeftRadius: space[1],
  })
);
