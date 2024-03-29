import { ArrowIconLeft } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { colors } from '@corona-dashboard/common';
import { getBackButtonValues } from './logic/get-back-button-values';
import { getCurrentPageScope } from '~/utils/get-current-page-scope';
import { LinkWithIcon } from '../link-with-icon';
import { List } from '@corona-dashboard/icons';
import { MaxWidth } from '~/components/max-width';
import { mediaQueries, space } from '~/style/theme';
import { Menu, MenuItemLink } from '~/components/aside/menu';
import { useIntl } from '~/intl';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

interface AppContentProps {
  children: React.ReactNode;
  sidebarComponent: React.ReactNode;
  mainComponent?: React.ReactNode;
  hideBackButton?: boolean;
  displayListButton?: boolean;
}

export function AppContent({ children, sidebarComponent, mainComponent, hideBackButton, displayListButton = false }: AppContentProps) {
  const router = useRouter();
  const reverseRouter = useReverseRouter();
  const { commonTexts } = useIntl();

  const isMenuOpen = router.pathname == '/landelijk' || router.pathname == '/verantwoording' || router.pathname == `/gemeente/[code]` || router.query.menu === '1';
  const currentPageScope = getCurrentPageScope(router);
  const currentCode = router.query.code as string | undefined;
  const backButtonConfig = { currentPageScope, currentCode, isMenuOpen, reverseRouter, commonTexts };
  const backButtonValues = getBackButtonValues(backButtonConfig);
  return (
    <MaxWidth paddingX={{ _: '0', lg: space[3] }}>
      <Box display={{ _: 'block', md: 'flex' }} flexDirection={{ _: 'column', md: 'row' }} margin={`0 auto ${space[4]} auto`} minHeight="50vh" paddingBottom={space[4]}>
        {backButtonValues?.url && (
          <BackButtonContainer isVisible={!hideBackButton} isMenuOpen={isMenuOpen}>
            <LinkWithIcon icon={<ArrowIconLeft />} href={backButtonValues?.url}>
              {backButtonValues?.text}
            </LinkWithIcon>
          </BackButtonContainer>
        )}

        <Box
          as="aside"
          borderRight={{ _: 'none', md: `1px solid ${colors.gray2}` }}
          flexGrow={0}
          flexShrink={0}
          minHeight={{ lg: '35em' }}
          width={{ md: '18rem', lg: '21rem' }}
          display={'block'}
          zIndex={3}
          justifyContent="center"
        >
          <Box display={displayListButton ? 'flex' : 'block'} flexDirection="column" justifyContent="space-between" height={displayListButton ? '100%' : undefined}>
            <ResponsiveVisible isVisible={isMenuOpen}>{mainComponent}</ResponsiveVisible>

            {displayListButton && (
              <ResponsiveVisible isVisible={isMenuOpen}>
                <Box maxWidth={{ _: '38rem', md: undefined }}>
                  <Menu>
                    <MenuItemLink
                      icon={<List />}
                      title={commonTexts.gemeente_layout.list.go_to_list_label}
                      href={reverseRouter.gm.lijstweergave()}
                      showArrow
                      isLinkForMainMenu={false}
                    />
                  </Menu>
                </Box>
              </ResponsiveVisible>
            )}
          </Box>
          <ResponsiveVisible isVisible={isMenuOpen}>{sidebarComponent}</ResponsiveVisible>
        </Box>

        {/* id is for hash navigation */}
        <Box as="main" id="content" flexGrow={1} flexShrink={1} minWidth={0} position="relative" width="100%" zIndex={3}>
          <ResponsiveVisible isVisible={!isMenuOpen}>{children}</ResponsiveVisible>

          {backButtonValues?.url && (
            <BackButtonContainer isVisible={!hideBackButton} marginTop={space[4]} isMenuOpen={isMenuOpen}>
              <LinkWithIcon icon={<ArrowIconLeft />} href={backButtonValues?.url}>
                {backButtonValues?.text}
              </LinkWithIcon>
            </BackButtonContainer>
          )}
        </Box>
      </Box>
    </MaxWidth>
  );
}

interface BackButtonContainerProps {
  isVisible: boolean;
  isMenuOpen: boolean;
}

const BackButtonContainer = styled(Box)<BackButtonContainerProps>`
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray3};
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  margin-inline: ${space[1]};
  max-width: ${({ isMenuOpen }) => (isMenuOpen ? '38rem' : undefined)};
  padding: ${space[3]} ${space[1]};
  position: relative;

  @media ${mediaQueries.xs} {
    margin-inline: ${({ isMenuOpen }) => (isMenuOpen ? 'auto' : undefined)};
  }

  @media ${mediaQueries.sm} {
    margin-inline: ${({ isMenuOpen }) => (!isMenuOpen ? space[5] : undefined)};
  }

  @media ${mediaQueries.md} {
    display: none;
  }
`;

interface ResponsiveVisibleProps {
  isVisible: boolean;
}

const ResponsiveVisible = styled.div<ResponsiveVisibleProps>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};

  @media ${mediaQueries.md} {
    display: ${({ isVisible }) => (!isVisible ? 'block' : undefined)};
  }

  .has-no-js & {
    display: block;
  }
`;
