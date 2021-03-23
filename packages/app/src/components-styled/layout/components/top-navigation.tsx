import css from '@styled-system/css';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import Close from '~/assets/close.svg';
import Menu from '~/assets/menu.svg';
import { MaxWidth } from '~/components-styled/max-width';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import theme from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { useIntl } from '~/intl';

export function TopNavigation() {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [needsMobileMenuLink, setNeedsMobileMenuLink] = useState(false);
  const breakpoints = useBreakpoints(true);
  const isSmallScreen = !breakpoints.md;
  const [panelHeight, setPanelHeight] = useState(0);
  const navMenu = useRef<HTMLDivElement>(null);
  const { siteText } = useIntl();

  useEffect(() => {
    // Menu is opened by default as fallback: JS opens it
    setIsMenuOpen(false);
    setPanelHeight(0);

    // Workaround to get the mobile menu opened when linking to a sub-page.
    setNeedsMobileMenuLink(isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    setPanelHeight(isMenuOpen ? 1000 : 0);
  }, [isMenuOpen]);

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
            {isMenuOpen
              ? siteText.nav.menu.close_menu
              : siteText.nav.menu.open_menu}
          </VisuallyHidden>
        </NavToggle>
      )}

      <NavWrapper
        id="main-navigation"
        role="navigation"
        aria-label={siteText.aria_labels.pagina_keuze}
        ref={navMenu}
        css={css({
          maxHeight: asResponsiveArray({ _: `${panelHeight}px`, md: '100%' }),
          opacity: asResponsiveArray({ _: isMenuOpen ? 1 : 0, md: 1 }),
          pointerEvents: asResponsiveArray({
            _: isMenuOpen ? 'auto' : 'none',
            md: 'auto',
          }),
          transition: asResponsiveArray({
            _: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out',
            md: 'none',
          }),
        })}
      >
        <MaxWidth>
          <NavList>
            <NavItem
              href="/"
              isActive={
                router.pathname === '/' ||
                router.pathname.startsWith('/actueel')
              }
            >
              {siteText.nav.links.actueel}
            </NavItem>
            <NavItem
              href={`/landelijk/vaccinaties${
                needsMobileMenuLink ? '?menu=1' : ''
              }`}
              isActive={router.pathname.startsWith('/landelijk')}
            >
              {siteText.nav.links.index}
            </NavItem>
            <NavItem href="/veiligheidsregio">
              {siteText.nav.links.veiligheidsregio}
            </NavItem>
            <NavItem href="/gemeente">{siteText.nav.links.gemeente}</NavItem>

            <NavItem href="/over">{siteText.nav.links.over}</NavItem>
          </NavList>
        </MaxWidth>
      </NavWrapper>
    </>
  );
}

function NavItem({
  href,
  children,
  isActive,
}: {
  href: string;
  children: string;
  isActive?: boolean;
}) {
  const { pathname } = useRouter();
  return (
    <StyledListItem>
      <Link passHref href={href}>
        <NavLink isActive={isActive ?? pathname.startsWith(href)}>
          <NavLinkSpan data-text={children}>{children}</NavLinkSpan>
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
    display: 'block',
    width: '100%',
    borderTopWidth: '1px',
    p: 0,
    [`@media ${theme.mediaQueries.md}`]: {
      display: 'inline',
      width: 'auto',
      borderTopWidth: 0,
      ml: 'auto',
      mt: 0,
      py: 1,
      flex: '0 0 auto',
    },
  })
);

const NavList = styled.ul(
  css({
    borderTop: asResponsiveArray({
      _: '1px solid rgba(255, 255, 255, 0.25)',
      md: 'none',
    }),
    listStyle: 'none',
    padding: 0,
    margin: 0,
    mt: asResponsiveArray({ _: '1.25rem', md: 0 }),
    display: asResponsiveArray({ _: 'block', md: 'flex' }),
  })
);

// Lines in mobile menu between items
const StyledListItem = styled.li(
  css({
    '&:not(:first-child)': {
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
      '&::after': {
        content: x.isActive ? '""' : undefined,
      },
    },

    // Show the underline
    '&:hover, &:focus': {
      [`${NavLinkSpan}::after`]: {
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

const NavLinkSpan = styled.span(
  css({
    display: 'inline-block',
    px: 3,
    py: '0.7rem',
    position: 'relative',

    '&::before': {
      display: 'block',
      content: 'attr(data-text)',
      fontWeight: 'bold',
      overflow: 'hidden',
      visibility: 'hidden',
      height: 0,
    },

    // Styled underline
    '&::after': {
      bg: 'white',
      right: 3,
      left: 3,
      bottom: '0.6rem',
      height: '0.15rem',
      position: 'absolute',
    },
  })
);
