import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { LinkWithIcon } from '~/components/link-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { ChevronRight, Down, Up } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import { isDefined } from 'ts-is-present';

interface IconWrapperProps {
  iconColor: string;
}

type TrendIcon = {
  direction: 'UP' | 'DOWN';
  color: 'GREEN' | 'RED';
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
  const containtsLink =
    isDefined(cta) && cta !== null ? { as: 'a', href: cta.href } : {};
  return (
    <Box
      {...containtsLink}
      spacing={3}
      borderColor={colors.gray}
      borderWidth="1px"
      borderStyle="solid"
      position="relative"
      display="flex"
      flexDirection={'column'}
      justifyContent={'space-between'}
      css={css({
        '&:hover .topipical-tile': {
          bg: colors.blue,
          color: colors.white,
        },
      })}
    >
      <>
        <Box display="flex" flexDirection={'column'} justifyContent={'start'}>
          <Box
            display="flex"
            flexDirection={{
              _: 'row-reverse',
              xs: 'column',
              sm: 'row-reverse',
            }}
            justifyContent={'space-between'}
          >
            <KpiIcon>
              <DynamicIcon name={tileIcon} />
            </KpiIcon>

            <Box display="block" fontSize={{ _: 6, xs: 7 }} flexShrink={0}>
              <Heading
                level={3}
                color={colors.blue}
                css={css({
                  display: 'flex',
                  justifyContent: 'start',
                  paddingLeft: asResponsiveArray({ _: 3, xs: 4 }),
                  paddingRight: asResponsiveArray({ _: 0, xs: 4, sm: 0 }),
                  paddingTop: asResponsiveArray({ _: 3, xs: 4 }),
                  marginBottom: 3,
                })}
              >
                {title}
                {isDefined(trendIcon) && trendIcon !== null && (
                  <IconWrapper iconColor={trendIcon.color}>
                    {trendIcon.direction === 'DOWN' && <Down />}
                    {trendIcon.direction === 'UP' && <Up />}
                  </IconWrapper>
                )}
              </Heading>
            </Box>
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

        {isDefined(cta) && cta !== null && (
          <Box
            display="flex"
            justifyContent={'center'}
            bg={colors.lightBlue}
            color={colors.blue}
            padding={3}
            className="topipical-tile"
            css={css({
              transition: 'background .1s ease-in-out',
            })}
          >
            <LinkWithIcon
              href={cta.href}
              icon={<ChevronRight />}
              iconPlacement="right"
            >
              {cta.label}
            </LinkWithIcon>
          </Box>
        )}
      </>
    </Box>
  );
}

const IconWrapper = styled.span<IconWrapperProps>((x) =>
  css({
    color: x.iconColor,
    display: 'inline',
    width: '20px',
    minWidth: '20px',
    marginLeft: '15px;',
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
    alignSelf: asResponsiveArray({ _: 'inherit', xs: 'end', sm: 'inherit' }),
  })
);
