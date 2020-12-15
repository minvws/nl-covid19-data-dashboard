import css from '@styled-system/css';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import text from '~/locale/index';
import { Link } from '~/utils/link';
import { useBreakpoints } from '~/utils/useBreakpoints';

export function TopNavigation() {
  const router = useRouter();
  const breakpoints = useBreakpoints(true);

  return (
    <nav
      id="main-navigation"
      role="navigation"
      aria-label={text.aria_labels.pagina_keuze}
    >
      <NavList>
        <NavItem
          href="/"
          isActive={
            router.pathname.indexOf('/landelijk') === 0 ||
            router.pathname === '/'
          }
        >
          {text.nav.links.index}
        </NavItem>
        <NavItem href="/veiligheidsregio">
          {text.nav.links.veiligheidsregio}
        </NavItem>
        <NavItem href="/gemeente">{text.nav.links.gemeente}</NavItem>

        {breakpoints.md && (
          <NavItem alignRight href="/over">
            {text.nav.links.over}
          </NavItem>
        )}
      </NavList>
    </nav>
  );
}

function NavItem({
  href,
  children,
  isActive,
  alignRight,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  alignRight?: boolean;
}) {
  const { pathname } = useRouter();
  return (
    <li css={css({ marginLeft: alignRight ? 'auto' : undefined })}>
      <Link passHref href={href}>
        <NavLink isActive={isActive ?? pathname.startsWith(href)}>
          {children}
        </NavLink>
      </Link>
    </li>
  );
}

const NavLink = styled.a<{ isActive: boolean }>((x) =>
  css({
    whiteSpace: 'nowrap',
    display: 'block',
    px: ['0.75em', null, '1.5em'],
    py: '1em',
    textDecoration: 'none',
    fontSize: ['1em', '1.125em'],

    color: 'inherit',

    '&:hover': {
      color: 'white',
      background: 'rgba(255, 255, 255, 0.1)',
      textDecoration: 'underline',
      textDecorationThickness: 'from-font',
    },

    '&:focus': {
      outline: '2px dotted #fff',
      outlineOffset: '-2px',
    },

    ...(x.isActive
      ? {
          color: 'black',
          background: 'rgba(255, 255, 255, 0.8)',

          '&:hover': {
            color: 'black',
            background: 'rgba(255, 255, 255, 0.8)',
          },
        }
      : undefined),
  })
);

const NavList = styled.ol(
  css({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    overflowX: 'auto',
  })
);
