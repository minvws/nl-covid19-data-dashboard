import css from '@styled-system/css';
import { Link } from '~/utils/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { isDefined } from 'ts-is-present';
import { useBreakpoints } from '~/utils/useBreakpoints';
import Menu from '~/assets/menu.svg';
import Close from '~/assets/close.svg';
import theme from '~/style/theme';
import { VisuallyHidden } from '~/components-styled/visually-hidden';

export function TopNavigation() {
  const router = useRouter();

  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const breakpoints = useBreakpoints();

  useEffect(() => {
    setIsSmallScreen(!breakpoints.md);
    setIsMenuOpen(false);
  }, [breakpoints.md]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      {isSmallScreen && (
        <NavToggle
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          {isMenuOpen ? <Close /> : <Menu />}
          <VisuallyHidden>
            {isMenuOpen ? text.nav.menu.close_menu : text.nav.menu.open_menu}
          </VisuallyHidden>
        </NavToggle>
      )}
      {(!isSmallScreen || isMenuOpen) && (
        <NavWrapper
          id="main-navigation"
          role="navigation"
          aria-label={text.aria_labels.pagina_keuze}
        >
          <MaxWidth>
            <NavList>
              <NavItem href="/" isActive={router.pathname === '/'}>
                {text.nav.links.actueel}
              </NavItem>
              <NavItem
                href="/landelijk"
                isActive={router.pathname.startsWith('/landelijk')}
              >
                {text.nav.links.index}
              </NavItem>
              <NavItem href="/veiligheidsregio">
                {text.nav.links.veiligheidsregio}
              </NavItem>
              <NavItem href="/gemeente">{text.nav.links.gemeente}</NavItem>

              <NavItem href="/over">{text.nav.links.over}</NavItem>
            </NavList>
          </MaxWidth>
        </NavWrapper>
      )}
    </>
  );
}

function NavItem({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  const { pathname } = useRouter();
  return (
    <StyledListItem>
      <Link passHref href={href}>
        <NavLink
          isActive={isDefined(isActive) ? isActive : pathname.startsWith(href)}
        >
          <span>{children}</span>
        </NavLink>
      </Link>
    </StyledListItem>
  );
}

const NavToggle = styled.button(
  css({
    ml: 'auto',
    color: 'white',
    bg: 'transparent',
    p: 0,
    m: 0,
    border: 'none',
    '&:focus': {
      bg: 'rgba(0, 0, 0, 0.1)',
    },
  })
);

const NavWrapper = styled.nav(
  css({
    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
    borderTopWidth: '1px',
    ml: -3,
    mr: -3,
    mt: 3,
    pt: 1,
    pb: 0,
    flex: '1 0 100%',
    width: 'auto',
    [`@media ${theme.mediaQueries.md}`]: {
      borderTopWidth: 0,
      ml: 'auto',
      mr: 0,
      mt: 0,
      pb: 1,
      flex: '0 0 auto',
    },
  })
);

const NavList = styled.ol(
  css({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: ['block', null, null, 'flex'],
  })
);

// Lines in mobile menu between items
const StyledListItem = styled.li(
  css({
    '& + &': {
      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
      borderTopWidth: ['1px', null, null, 0],
    },
  })
);

const NavLink = styled.a<{ isActive: boolean }>((x) =>
  css({
    display: 'block',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontSize: '1.1rem',
    color: 'white',

    // The span is a narrower element to position the underline to
    '& span': {
      display: 'inline-block',
      px: [0, null, null, '1.5rem'],
      py: '0.7rem',
      position: 'relative',

      // Styled underline
      '&::before': {
        content: x.isActive ? '""' : undefined,
        bg: 'white',
        right: [0, null, null, '1.5rem'],
        left: [0, null, null, '1.5rem'],
        bottom: '0.6rem',
        height: '0.15rem',
        position: 'absolute',
      },
    },

    // Show the underline
    '&:hover, &:focus': {
      'span::before': {
        content: '""',
      },
    },

    '&:focus': {
      bg: 'rgba(0, 0, 0, 0.1)',
    },

    ...(x.isActive
      ? {
          fontWeight: 'bold',
        }
      : undefined),
  })
);
