import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { UrlObject } from 'url';
import ArrowIcon from '~/assets/arrow.svg';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import siteText from '~/locale/index';
import { Link } from '~/utils/link';

interface AppContentProps {
  children: React.ReactNode;
  renderSidebar: React.ReactNode;
  renderSearch?: React.ReactNode;
  hideMenuButton?: boolean;
}

export function AppContent({
  children,
  renderSidebar,
  renderSearch,
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
    (router.pathname === '/' && !('menu' in router.query)) ||
    router.query.menu === '1';

  return (
    <MaxWidth px={[0, 0, 0, 0, 3]}>
      <AppContentContainer>
        {!hideMenuButton && (
          <MenuButton href={menuOpenUrl} isVisible={!isMenuOpen} />
        )}

        <StyledSidebar>
          <ResponsiveVisible isVisible={isMenuOpen}>
            {renderSearch}
            {renderSidebar}
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
            <MenuLink href={menuOpenUrl} isVisible={!isMenuOpen} />
          </Box>
        </StyledAppContent>
      </AppContentContainer>
    </MaxWidth>
  );
}

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
    zIndex: 2,
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

function MenuLink({
  href,
  isVisible,
}: {
  href: UrlObject | string;
  isVisible: boolean;
}) {
  const router = useRouter();
  return (
    <Link href={href} passHref>
      <a
        css={css({
          px: [2, null, 0],
          display: [isVisible ? 'block' : 'none', null, null, 'none'],
        })}
      >
        <Arrow />
        {router.pathname === '/'
          ? siteText.nav.terug_naar_alle_cijfers_homepage
          : siteText.nav.terug_naar_alle_cijfers}
      </a>
    </Link>
  );
}

const StyledMenuButton = styled.a<{ isVisible: boolean }>((x) =>
  css({
    background: 'white',
    width: '100%',
    padding: '1em',
    boxShadow: 'tile',
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

    display: [x.isVisible ? 'block' : 'none', null, null, 'none'],

    '.has-no-js &': {
      display: 'none',
    },
  })
);

function Arrow() {
  return (
    <span
      css={css({
        svg: {
          height: '10px',
          width: '16px',
          transform: 'rotate(90deg)',
          marginRight: '0.7em',
        },
      })}
    >
      <ArrowIcon />
    </span>
  );
}
