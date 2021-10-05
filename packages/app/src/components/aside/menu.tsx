import css from '@styled-system/css';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import { NextRouter, useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import chevronUrl from '~/assets/chevron.svg';
import { Box } from '~/components/base';
import { Anchor, Heading, Text } from '~/components/typography';
import { ExpandedSidebarMap, Layout } from '~/domain/layout/logic/types';
import { SpaceValue } from '~/style/theme';
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

export function Menu({
  children,
  spacing,
}: {
  children: ReactNode;
  spacing?: SpaceValue;
}) {
  return (
    <Box as="ul" css={css({ listStyle: 'none' })} spacing={spacing}>
      {children}
    </Box>
  );
}

export function CategoryMenu({
  title,
  description,
  children,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <Box as="li" spacing={2}>
      {title && (
        <Box px={3} pt={3}>
          <Heading
            level={4}
            css={css({
              color: 'bodyLight',
              fontSize: 1,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            })}
          >
            {title}
          </Heading>
        </Box>
      )}
      {description && (
        <Box px={3}>
          <Text css={css({ fontSize: 1, color: 'bodyLight' })}>
            {description}
          </Text>
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

export function MenuItemLink({ href, icon, title }: MenuItemLinkProps) {
  const router = useRouter();
  const breakpoints = useBreakpoints(true);

  if (!href) {
    return (
      <li>
        <Unavailable>
          <AsideTitle icon={icon} title={title} />
        </Unavailable>
      </li>
    );
  }

  const isActive = isActivePath(router, href);

  return (
    <li>
      <Link href={href} passHref>
        <StyledAnchor
          isActive={breakpoints.md && isActive}
          aria-current={isActive ? 'page' : undefined}
        >
          <AsideTitle
            icon={icon}
            title={title}
            showArrow={!breakpoints.md || !isActive}
          />
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
    padding: 2,
    color: 'gray',

    svg: {
      fill: 'currentColor',
    },
  })
);

const StyledAnchor = styled(Anchor)<{ isActive: boolean }>((x) =>
  css({
    p: 2,
    display: 'block',
    borderRight: '5px solid transparent',
    color: x.isActive ? 'blue' : 'black',
    position: 'relative',
    bg: x.isActive ? 'lightBlue' : 'transparent',
    borderRightColor: x.isActive ? 'sidebarLinkBorder' : 'transparent',

    '&:hover': {
      bg: 'offWhite',
    },

    '&:focus': {
      bg: '#ebebeb',
    },

    '&::after': {
      content: x.isActive
        ? 'none'
        : asResponsiveArray({ _: 'none', xs: undefined }),
      backgroundImage: `url('${chevronUrl}')`,
      // match aspect ratio of chevron.svg
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: 3,
      top: '1.35em',
    },
  })
);
