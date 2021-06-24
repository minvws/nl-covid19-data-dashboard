import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { LinkWithIcon } from '../link-with-icon';

interface AppContentProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
  searchComponent?: React.ReactNode;
  hideMenuButton?: boolean;
}

export function AppContent({
  children,
  sidebarComponent,
  searchComponent,
  hideMenuButton,
}: AppContentProps) {
  const router = useRouter();
  const { siteText } = useIntl();

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

  const menuOpenText = router.pathname.startsWith('/landelijk')
    ? siteText.nav.terug_naar_alle_cijfers_homepage
    : router.pathname.startsWith('/veiligheidsregio')
    ? siteText.nav.terug_naar_alle_cijfers_veiligheidsregio
    : router.pathname.startsWith('/gemeente')
    ? siteText.nav.terug_naar_alle_cijfers_gemeente
    : siteText.nav.terug_naar_alle_cijfers;
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
            <LinkWithIcon icon={<ArrowIconLeft />} href={menuOpenUrl}>
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
              <LinkWithIcon icon={<ArrowIconLeft />} href={menuOpenUrl}>
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
    bg: asResponsiveArray({ _: 'page', md: 'white' }),
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
