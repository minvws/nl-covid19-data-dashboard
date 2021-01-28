import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import siteText from '~/locale/index';
import { LinkWithIcon } from '../link-with-icon';

interface AppContentProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
  searchComponent?: React.ReactNode;
  hideMenuButton?: boolean;
}

function getMenuOpenText(pathname: string) {
  if (pathname.startsWith('/landelijk')) {
    return siteText.nav.terug_naar_alle_cijfers_homepage;
  }
  if (pathname.startsWith('/veiligheidsregio')) {
    return siteText.nav.terug_naar_alle_cijfers_veiligheidsregio;
  }
  if (pathname.startsWith('/gemeente')) {
    return siteText.nav.terug_naar_alle_cijfers_gemeente;
  }
  return siteText.nav.terug_naar_alle_cijfers;
}

export function AppContent({
  children,
  sidebarComponent,
  searchComponent,
  hideMenuButton,
}: AppContentProps) {
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
    router.pathname == '/landelijk' || router.query.menu === '1';

  const menuOpenText = getMenuOpenText(router.pathname);

  return (
    <MaxWidth px={[0, 0, 0, 0, 3]}>
      <AppContentContainer>
        {!hideMenuButton && (
          <MenuLinkContainer
            isVisible={!isMenuOpen}
            css={css({
              background: 'white',
              padding: '1em',
              boxShadow: 'tile',
              position: 'relative',
            })}
          >
            <LinkWithIcon
              icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
              href={menuOpenUrl}
            >
              {menuOpenText}
            </LinkWithIcon>
          </MenuLinkContainer>
        )}

        <StyledSidebar>
          <ResponsiveVisible isVisible={isMenuOpen}>
            {searchComponent}
            {sidebarComponent}
          </ResponsiveVisible>
        </StyledSidebar>

        <StyledAppContent
          /** id is for hash navigation */
          id="content"
        >
          <Box spacing={4}>
            <ResponsiveVisible isVisible={!isMenuOpen}>
              {children}
            </ResponsiveVisible>
            <MenuLinkContainer isVisible={!isMenuOpen && !hideMenuButton}>
              <LinkWithIcon
                icon={<ArrowIcon css={css({ transform: 'rotate(90deg)' })} />}
                href={menuOpenUrl}
              >
                {menuOpenText}
              </LinkWithIcon>
            </MenuLinkContainer>
          </Box>
        </StyledAppContent>
      </AppContentContainer>
    </MaxWidth>
  );
}

const MenuLinkContainer = styled(Box)<{ isVisible: boolean }>((x) =>
  css({
    px: [3, null, 0],
    display: [x.isVisible ? 'block' : 'none', null, null, 'none'],
  })
);

const AppContentContainer = styled.div(
  css({
    display: ['block', null, null, 'flex'],
    flexDirection: ['column', null, null, 'row'],
    marginBottom: '2rem',
    margin: '0 auto',
    pb: 4,
  })
);

const StyledAppContent = styled.main(
  css({
    bg: 'page',
    zIndex: 3,
    width: '100%',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
  })
);

const StyledSidebar = styled.aside(
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
