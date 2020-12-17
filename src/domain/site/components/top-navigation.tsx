import css from '@styled-system/css';
import { Link } from '~/utils/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { useBreakpoints } from '~/utils/useBreakpoints';
import Menu from '~/assets/menu.svg';
import Close from '~/assets/close.svg';
import theme from '~/style/theme';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { asResponsiveArray } from '~/style/utils';

export function TopNavigation() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const breakpoints = useBreakpoints(true);
  const isSmallScreen = !breakpoints.md;

  useEffect(() => {
    // Menu is opened by default as fallback: JS opens it
    setIsMenuOpen(false);
  }, []);

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
        <NavLink isActive={isActive ?? pathname.startsWith(href)}>
          <NavLinkSpan>{children}</NavLinkSpan>
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

const NavList = styled.ul(
  css({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: asResponsiveArray({ _: 'block', md: 'flex' }),
  })
);

// Lines in mobile menu between items
const StyledListItem = styled.li(
  css({
    '& + &': {
      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
      borderTopWidth: asResponsiveArray({ _: '1px', md: 0 }),
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
    [NavLinkSpan]: {
      // Styled underline
      '&::before': {
        content: x.isActive ? '""' : undefined,
      },
    },

    // Show the underline
    '&:hover, &:focus': {
      [`${NavLinkSpan}::before`]: {
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

const NavLinkSpan = styled.span(() => {
  const horizontalSpace = asResponsiveArray({ _: 0, md: '1.5rem' });

  return css({
    display: 'inline-block',
    px: horizontalSpace,
    py: '0.7rem',
    position: 'relative',

    // Styled underline
    '&::before': {
      bg: 'white',
      right: horizontalSpace,
      left: horizontalSpace,
      bottom: '0.6rem',
      height: '0.15rem',
      position: 'absolute',
    },
  });
});
