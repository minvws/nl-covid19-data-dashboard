import { Box } from '~/components/base';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Heading } from '~/components/typography';
import { LinkWithIcon } from '~/components/link-with-icon';
import { asResponsiveArray } from '~/style/utils';
import { colors } from '@corona-dashboard/common';
import DynamicIcon from '~/components/get-icon-by-name';
import { Chevron, Down, Up } from '@corona-dashboard/icons';
import { Markdown } from '~/components/markdown';
import { TopicalIcon } from '@corona-dashboard/common/src/types';
import { isDefined } from 'ts-is-present';

interface IconWrapperProps {
  iconColor: any;
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
  return (
    <Box
      spacing={3}
      borderColor={colors.gray}
      borderWidth="1px"
      borderStyle="solid"
      position="relative"
      display="flex"
      flexDirection={'column'}
      justifyContent={'space-between'}
    >
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent={'start'}
        textAlign={'left'}
        p={{ _: 3, xs: 4 }}
      >
        <KpiIcon>
          <DynamicIcon name={tileIcon} />
        </KpiIcon>

        <Box
          display="block"
          fontSize={{ _: 6, xs: 7 }}
          paddingRight={5}
          marginBottom={3}
        >
          <Heading
            level={3}
            color={colors.blue}
            css={css({
              display: 'flex',
              alignItems: 'center',
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

        <Box display="flex" alignItems={'center'}>
          <Markdown content={dynamicDescription} />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent={'center'}
        bg={colors.lightBlue}
        color={colors.blue}
        padding={3}
      >
        {isDefined(cta) && cta !== null && (
          <LinkWithIcon
            href={cta.href}
            icon={<Chevron />}
            iconPlacement="right"
          >
            {cta.label}
          </LinkWithIcon>
        )}
      </Box>
    </Box>
  );
}

const IconWrapper = styled.span<IconWrapperProps>((x) =>
  css({
    color: x.iconColor,
    display: 'inline-flex',
    alignItems: 'center',
    width: '20px',
    marginLeft: '15px;',
  })
);

const KpiIcon = styled.span(
  css({
    color: colors.white,
    backgroundColor: colors.blue,
    position: 'absolute',
    display: 'block',
    width: asResponsiveArray({ _: 40, sm: 50 }),
    height: asResponsiveArray({ _: 40, sm: 50 }),
    right: 0,
    top: 0,
  })
);
