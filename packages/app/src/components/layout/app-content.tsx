import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
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

export function AppContent({ children, sidebarComponent, searchComponent, hideBackButton }: AppContentProps) {
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  const isMenuOpen = router.pathname == '/landelijk' || router.pathname == '/veiligheidsregio/[code]' || router.pathname == '/gemeente/[code]' || router.query.menu === '1';

  const currentPageScope = getCurrentPageScope(router);
  const currentCode = router.query.code as string | undefined;
  const isNational = currentPageScope === 'nl';

  /**
   * @TODO Open the menu purely client side without loading a new page
   */
  const backButtonUrl = currentPageScope ? (isMenuOpen ? (isNational ? reverseRouter.topical.nl : undefined) : reverseRouter[currentPageScope].index(currentCode)) : undefined;

  const backButtonText = currentPageScope ? (isMenuOpen ? (isNational ? commonTexts.nav.back_topical.nl : '') : commonTexts.nav.back_all_metrics[currentPageScope]) : '';

  return (
    <MaxWidth paddingX={{ _: '0', lg: space[3] }}>
      <AppContentContainer>
        {backButtonUrl && (
          <>
            <BackButtonContainer
              isMenuOpen={isMenuOpen}
              isVisible={!hideBackButton}
              css={css({
                background: 'white',
                paddingY: space[3],
                position: 'relative',
                borderBottom: 'solid 1px',
                borderColor: colors.gray3,
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
          <ResponsiveVisible isVisible={!isMenuOpen}>{children}</ResponsiveVisible>
          {backButtonUrl && (
            <BackButtonContainer isVisible={!hideBackButton} marginTop={space[4]} isMenuOpen={isMenuOpen}>
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
  isMenuOpen: boolean;
}>((x) =>
  css({
    marginX: x.isMenuOpen ? asResponsiveArray({ _: space[1], xs: 'auto' }) : asResponsiveArray({ _: space[1], sm: space[5] }),
    display: [x.isVisible ? 'block' : 'none', null, null, 'none'],
    paddingX: space[1],
    maxWidth: x.isMenuOpen ? '38rem' : undefined,
  })
);

const AppContentContainer = styled.div(
  css({
    display: ['block', null, null, 'flex'],
    flexDirection: ['column', null, null, 'row'],
    marginBottom: space[4],
    margin: `0 auto`,
    paddingBottom: space[4],
    minHeight: '50vh',
  })
);

const StyledAppContent = styled.main(
  css({
    zIndex: 3,
    position: 'relative',
    width: '100%',
    minWidth: '0',
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
      md: `solid 1px ${colors.gray2}`,
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
