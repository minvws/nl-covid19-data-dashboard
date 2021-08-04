import css from '@styled-system/css';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import Close from '~/assets/close.svg';
import Menu from '~/assets/menu.svg';
import { MaxWidth } from '~/components/max-width';
import { Anchor } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { Link } from '~/utils/link';
import { useCollapsible } from '~/utils/use-collapsible';
import { useMediaQuery } from '~/utils/use-media-query';
import { useReverseRouter } from '~/utils/use-reverse-router';

const wideNavBreakpoint = 'screen and (min-width: 1024px)';

export function TopNavigation() {
  const isWideNav = useMediaQuery(wideNavBreakpoint);
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { siteText } = useIntl();
  const collapsible = useCollapsible({ isOpen: isWideNav });

  const internationalFeature = useFeature('inHomePage');

  return (
    <>
      <div
        css={css({
          display: 'block',
          [`@media ${wideNavBreakpoint}`]: { display: 'none' },
          '.has-no-js &': { display: 'none' },
        })}
      >
        {collapsible.button(
          <NavToggle>
            {collapsible.isOpen ? <Close /> : <Menu />}
            <VisuallyHidden>
              {collapsible.isOpen
                ? siteText.nav.menu.close_menu
                : siteText.nav.menu.open_menu}
            </VisuallyHidden>
          </NavToggle>
        )}
      </div>

      <NavWrapper
        key={isWideNav ? 1 : 0}
        role="navigation"
        aria-label={siteText.aria_labels.pagina_keuze}
      >
        {collapsible.content(
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
                href={reverseRouter.nl.index()}
                isActive={router.pathname.startsWith('/landelijk')}
              >
                {siteText.nav.links.index}
              </NavItem>
              <NavItem href={reverseRouter.vr.index()}>
                {siteText.nav.links.veiligheidsregio}
              </NavItem>
              <NavItem href={reverseRouter.gm.index()}>
                {siteText.nav.links.gemeente}
              </NavItem>

              {internationalFeature.isEnabled ? (
                <NavItem
                  href={reverseRouter.in.index()}
                  isActive={router.pathname.startsWith('/internationaal')}
                >
                  {siteText.nav.links.internationaal}
                </NavItem>
              ) : null}

              <NavItem href={reverseRouter.algemeen.over()}>
                {siteText.nav.links.over}
              </NavItem>
            </NavList>
          </MaxWidth>
        )}
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
        <NavLink
          isActive={
            isActive ?? (pathname === href || pathname.startsWith(`${href}/`))
          }
        >
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
    overflow: 'hidden',

    [`@media ${wideNavBreakpoint}`]: {
      height: 'auto !important',
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
    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    mt: '1.25rem',
    display: 'block',

    [`@media ${wideNavBreakpoint}`]: {
      borderTop: 'none',
      mt: 0,
      display: 'flex',
    },
  })
);

// Lines in mobile menu between items
const StyledListItem = styled.li(
  css({
    '&:not(:first-child)': {
      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
      borderTopWidth: '1px',

      [`@media ${wideNavBreakpoint}`]: {
        borderTopWidth: 0,
      },
    },
  })
);

const NavLink = styled(Anchor)<{ isActive: boolean }>((x) =>
  css({
    display: 'block',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontSize: '1rem',
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
    px: 2,
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
      right: 2,
      left: 2,
      bottom: '0.6rem',
      height: '0.15rem',
      position: 'absolute',
    },
  })
);
