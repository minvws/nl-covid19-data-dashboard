import { colors, ScopedData } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { getCurrentPageScope } from '~/utils/get-current-page-scope';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { LinkWithIcon } from '../link-with-icon';

interface AppContentProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
  searchComponent?: React.ReactNode;
  hideBackButton?: boolean;
}

interface BackButtonProps {
  text: string;
  url?: string;
}

export function AppContent({
  children,
  sidebarComponent,
  searchComponent,
  hideBackButton,
}: AppContentProps) {
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  const isMenuOpen =
    router.pathname == '/landelijk' ||
    router.pathname == '/veiligheidsregio/[code]' ||
    router.pathname == '/gemeente/[code]' ||
    router.query.menu === '1';

  const currentPageScope = getCurrentPageScope(router);
  const currentCode = router.query.code as string | undefined;

  const getBackButtonProps = (
    pageScope: keyof ScopedData | undefined,
    menuOpen: boolean
  ): BackButtonProps => {
    if (!pageScope) {
      return {
        text: '',
      };
    }

    if (!menuOpen) {
      return {
        text: commonTexts.nav.back_all_metrics[pageScope],
        url: reverseRouter[pageScope].index(currentCode),
      };
    }

    if (pageScope !== 'nl') {
      return {
        text: '',
      };
    }

    return {
      text: commonTexts.nav.back_topical.nl,
      url: reverseRouter.topical.nl,
    };
  };

  /**
   * @TODO Open the menu purely client side without loading a new page
   */
  const { url: backButtonUrl, text: backButtonText } = getBackButtonProps(
    currentPageScope,
    isMenuOpen
  );

  const menuOpenBackButtonStyles = isMenuOpen && {
    maxWidth: '38rem',
  };

  return (
    <MaxWidth px={[0, 0, 0, 0, 3]}>
      <AppContentContainer>
        {backButtonUrl && (
          <>
            <BackButtonContainer
              isVisible={!hideBackButton}
              css={css({
                background: 'white',
                py: 3,
                position: 'relative',
                borderBottom: 'solid 1px',
                borderColor: 'border',
                ...menuOpenBackButtonStyles,
              })}
            >
              <LinkWithIcon icon={<ArrowIconLeft />} href={backButtonUrl}>
                {backButtonText}
              </LinkWithIcon>
            </BackButtonContainer>
          </>
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
          <ResponsiveVisible isVisible={!isMenuOpen}>
            {children}
          </ResponsiveVisible>
          {backButtonUrl && (
            <BackButtonContainer
              isVisible={!hideBackButton}
              mt={4}
              css={css({
                ...menuOpenBackButtonStyles,
              })}
            >
              <LinkWithIcon icon={<ArrowIconLeft />} href={backButtonUrl}>
                {backButtonText}
              </LinkWithIcon>
            </BackButtonContainer>
          )}
        </StyledAppContent>
      </AppContentContainer>
    </MaxWidth>
  );
}

const BackButtonContainer = styled(Box)<{
  isVisible: boolean;
}>((x) =>
  css({
    display: [x.isVisible ? 'block' : 'none', null, null, 'none'],
    px: asResponsiveArray({ _: 1, sm: 1 }),
    mx: asResponsiveArray({ _: 1, sm: 5 }),
  })
);

const AppContentContainer = styled.div(
  css({
    display: ['block', null, null, 'flex'],
    flexDirection: ['column', null, null, 'row'],
    marginBottom: '2rem',
    margin: '0 auto',
    pb: 4,
    minHeight: '50vh',
  })
);

const StyledAppContent = styled.main(
  css({
    zIndex: 3,
    position: 'relative',
    width: '100%',
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
  })
);

const StyledSidebar = styled.aside(
  css({
    zIndex: 3,
    minHeight: [null, null, null, null, '35em'],
    width: asResponsiveArray({ md: '18rem', lg: '21rem' }),
    flexShrink: 0,
    flexGrow: 0,
    borderRight: asResponsiveArray({
      _: 'none',
      md: `solid 1px ${colors.lightGray}`,
    }),
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
