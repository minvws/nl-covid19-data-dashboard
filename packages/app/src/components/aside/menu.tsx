import css from '@styled-system/css';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import { NextRouter, useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import chevronUrl from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { Anchor, Heading } from '~/components/typography';
import { ExpandedSidebarMap, Layout } from '~/domain/layout/logic/types';
import { space, SpaceValue } from '~/style/theme';
import { colors } from '@corona-dashboard/common';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { AsideTitle } from './title';

type Url = UrlObject | string;

export function MenuRenderer({ items }: { items: ExpandedSidebarMap<Layout> }) {
  return (
    <>
      {items.map((x) =>
        'items' in x ? (
          <CategoryMenu {...x}>
            {x.items.map((item) => (
              // item includes key, ESLint gives a false positive here
              // eslint-disable-next-line react/jsx-key
              <MenuItemLink {...item} />
            ))}
          </CategoryMenu>
        ) : (
          <MenuItemLink {...x} />
        )
      )}
    </>
  );
}

export function Menu({ children, spacing }: { children: ReactNode; spacing?: SpaceValue }) {
  return (
    <Box as="ul" css={css({ listStyle: 'none' })} spacing={spacing}>
      {children}
    </Box>
  );
}

export function CategoryMenu({ title, children, icon }: { children: ReactNode; title?: string; icon: ReactNode }) {
  return (
    <Box as="li" spacing={2}>
      {title && icon && (
        <Box paddingX={space[2]} paddingTop={space[3]} display="flex" alignItems="center">
          <Icon>{icon}</Icon>
          <Heading level={5}>{title}</Heading>
        </Box>
      )}
      <Menu>{children}</Menu>
    </Box>
  );
}

interface MenuItemLinkProps {
  title: string;
  icon?: ReactNode;
  href?: Url;
  showArrow?: boolean;
}

export function MenuItemLink({ href, title }: MenuItemLinkProps) {
  const router = useRouter();
  const breakpoints = useBreakpoints(true);

  if (!href) {
    return (
      <li>
        <Unavailable>
          <AsideTitle title={title} />
        </Unavailable>
      </li>
    );
  }

  const isActive = isActivePath(router, href);

  return (
    <li>
      <Link href={href} passHref>
        <StyledAnchor isActive={breakpoints.md && isActive} aria-current={isActive ? 'page' : undefined}>
          <AsideTitle title={title} showArrow={!breakpoints.md || !isActive} />
        </StyledAnchor>
      </Link>
    </li>
  );
}

function isActivePath(router: NextRouter, href: Url) {
  const currentPath = (router.asPath || '/').split('?')[0];
  const hrefPath = resolveHref(router, href).split('?')[0];
  return currentPath === hrefPath;
}

const Unavailable = styled.span(
  css({
    display: 'block',
    padding: space[2],
    color: colors.gray5,

    svg: {
      fill: 'currentColor',
    },
  })
);

const StyledAnchor = styled(Anchor)<{ isActive: boolean }>((anchorProps) =>
  css({
    padding: space[2],
    paddingLeft: '3rem',
    display: 'block',
    borderRight: '5px solid transparent',
    color: anchorProps.isActive ? colors.blue8 : 'black',
    fontWeight: anchorProps.isActive ? 'bold' : 'normal',
    position: 'relative',
    bg: anchorProps.isActive ? 'blue1' : 'transparent',
    borderRightColor: anchorProps.isActive ? colors.blue8 : 'transparent',

    '&:hover, &:focus': {
      bg: 'blue8',
      color: colors.white,
      fontWeight: 'bold',
      svg: {
        color: colors.white,
      },
    },

    '&::after': {
      content: anchorProps.isActive ? 'none' : asResponsiveArray({ _: 'none', xs: undefined }),
      backgroundImage: `url('${chevronUrl}')`,
      // match aspect ratio of chevron.svg
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: space[3],
      top: '1.35em',
    },
  })
);

const Icon = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      role="img"
      aria-hidden="true"
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      padding="0"
      marginRight="0"
      marginTop="-3px"
      css={css({
        width: '2.5rem',
        height: '2.5rem',
        svg: {
          height: '2.25rem',
          fill: 'currentColor',
        },
      })}
    >
      {children}
    </Box>
  );
};
