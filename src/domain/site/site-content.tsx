import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { UrlObject } from 'url';
import Arrow from '~/assets/arrow.svg';
import { MaxWidth } from '~/components-styled/max-width';
import siteText from '~/locale/index';
import { Link } from '~/utils/link';

interface SiteContentProps {
  children: React.ReactNode;
  renderSidebar: React.ReactNode;
  renderSearch?: React.ReactNode;
  hideMenuButton?: boolean;
}

export function SiteContent({
  children,
  renderSidebar,
  renderSearch,
  hideMenuButton,
}: SiteContentProps) {
  const router = useRouter();

  const menuOpenUrl = {
    pathname: router.pathname,
    query: { ...router.query, menu: '1' },
  };

  /**
   * @TODO Possibly not the right place to check the "homepage" (/) menu-state,
   * but it's good enough for now I guess
   */
  const isMenuOpen =
    (router.pathname === '/' && !('menu' in router.query)) ||
    router.query.menu === '1';

  const menuButton = <MenuButton href={menuOpenUrl} isVisible={!isMenuOpen} />;

  return (
    <MaxWidth px={[0, 0, 0, 0, 3]}>
      <SiteContentContainer>
        {!hideMenuButton && menuButton}

        <StyledSidebar>
          <ResponsiveVisible isVisible={isMenuOpen}>
            {renderSearch}
            {renderSidebar}
          </ResponsiveVisible>
        </StyledSidebar>

        <StyledSiteContent
          /** id is for hash navigation */
          id="content"
        >
          <ResponsiveVisible isVisible={!isMenuOpen}>
            {children}
          </ResponsiveVisible>
        </StyledSiteContent>

        {menuButton}
      </SiteContentContainer>
    </MaxWidth>
  );
}

const SiteContentContainer = styled.div(
  css({
    display: ['block', null, null, 'flex'],
    flexDirection: ['column', null, null, 'row'],
    marginBottom: '2rem',
    margin: '0 auto',
  })
);

export const StyledSiteContent = styled.main(
  css({
    bg: 'page',
    zIndex: 2,
    width: '100%',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
  })
);

export const StyledSidebar = styled.aside(
  css({
    bg: 'white',
    zIndex: 3,
    minHeight: [null, null, null, null, '35em'],
    width: [null, null, null, '25em'],
    flexShrink: 0,
    flexGrow: 0,
    boxShadow: '1px -1px 5px #e5e5e5, -1px -1px 5px #e5e5e5',
  })
);

const ResponsiveVisible = styled.div<{ isVisible: boolean }>((x) =>
  css({
    display: x.isVisible ? 'block' : ['none', null, null, 'block'],

    '.has-no-js &': {
      display: 'block',
    },
  })
);

function MenuButton({
  href,
  className,
  isVisible,
}: {
  className?: string;
  href: UrlObject | string;
  isVisible: boolean;
}) {
  const router = useRouter();
  return (
    <Link href={href} passHref>
      <StyledMenuButton className={className} isVisible={isVisible}>
        <Arrow />
        {router.pathname === '/'
          ? siteText.nav.terug_naar_alle_cijfers_homepage
          : siteText.nav.terug_naar_alle_cijfers}
      </StyledMenuButton>
    </Link>
  );
}

const StyledMenuButton = styled.a<{ isVisible: boolean }>((x) =>
  css({
    background: 'white',
    width: '100%',
    padding: '1em',
    boxShadow: `0 -1px 1px 0 #e5e5e5, 0 1px 1px 0 #e5e5e5, 0 2px 2px 0 #e5e5e5,
    0 4px 4px 0 #e5e5e5, 0 6px 6px 0 #e5e5e5`,
    position: 'relative',
    zIndex: '2',
    textDecoration: 'none',

    '&.backButtonFooter': {
      background: 'none',
      boxShadow: 'none',
    },

    '&:hover, &:focus': {
      textDecoration: 'underline',
    },

    '> svg': {
      height: '10px',
      width: '16px',
      transform: 'rotate(90deg)',
      marginRight: '0.7em',
    },

    display: [x.isVisible ? 'block' : 'none', null, null, 'none'],

    '.has-no-js &': {
      display: 'none',
    },
  })
);
