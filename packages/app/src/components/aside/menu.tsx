import { Anchor, Heading } from '~/components/typography';
import { ArchivedPath, useArchivedPaths } from '~/utils/use-archived-paths';
import { AsideTitle } from './title';
import { asResponsiveArray } from '~/style/utils';
import { Box } from '~/components/base';
import chevronUrl from '~/assets/chevron.svg';
import css from '@styled-system/css';
import { CategoryDropdown, CategoryDropdownRoot, CategoryListBox, CategoryListBoxOption, CategorySelectBox } from '~/components/aside/components/CategoryDropdown';
import { colors } from '@corona-dashboard/common';
import { ExpandedSidebarMap, Layout } from '~/domain/layout/logic/types';
import { Link } from '~/utils/link';
import { NextRouter, useRouter } from 'next/router';
import { ReactNode } from 'react';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import { space, SpaceValue } from '~/style/theme';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useCollapsible } from '~/utils/use-collapsible';

type Url = UrlObject | string;

export function MenuRenderer({ items }: { items: ExpandedSidebarMap<Layout> }) {
  return (
    <>
      {items.map((x) =>
        'items' in x && (x.key === 'archived_metrics' || x.title === 'Gearchiveerd') ? (
          <CollapsibleCategoryMenu {...x}>
            {x.items.map((item) => (
              // item includes key, ESLint gives a false positive here
              // eslint-disable-next-line react/jsx-key
              <MenuItemLink {...item} />
            ))}
          </CollapsibleCategoryMenu>
        ) : 'items' in x ? (
          <CategoryMenu {...x}>
            {x.items.map((item) => (
              // item includes key, ESLint gives a false positive here
              // eslint-disable-next-line react/jsx-key
              <MenuItemLink {...item} />
            ))}
          </CategoryMenu>
        ) : (
          <MenuItemLink {...x} />
        )
      )}
    </>
  );
}

export function Menu({ children, spacing }: { children: ReactNode; spacing?: SpaceValue }) {
  return (
    <Box as="ul" css={css({ listStyle: 'none' })} spacing={spacing}>
      {children}
    </Box>
  );
}

export function CollapsibleCategoryMenu({ title, children, icon }: { children: ReactNode; title?: string; icon: ReactNode; key: string }) {
  const router = useRouter();
  const archivedPaths = useArchivedPaths();
  const { button: collapsibleButton, content: collapsibleContent, chevron: collapseChevron } = useCollapsible({ isOpen: isCurrentRouteArchivedPage(router, archivedPaths) });

  return (
    <Box as="li" mt={space[4]} mb={space[4]}>
      <CategoryDropdownRoot>
        {title &&
          icon &&
          collapsibleButton(
            <CategoryDropdown>
              <CategorySelectBox>
                <Icon>{icon}</Icon>
                <Heading level={5}>{title}</Heading>
              </CategorySelectBox>
              {collapseChevron}
            </CategoryDropdown>
          )}
        <CategoryListBox as="ul">{collapsibleContent(<CategoryListBoxOption>{children}</CategoryListBoxOption>)}</CategoryListBox>
      </CategoryDropdownRoot>
    </Box>
  );
}

export function CategoryMenu({ title, children, icon }: { children: ReactNode; title?: string; icon: ReactNode }) {
  return (
    <Box as="li" spacing={2}>
      {title && icon && (
        <Box paddingX={space[2]} paddingTop={space[3]} display="flex" alignItems="center">
          <Icon>{icon}</Icon>
          <Heading level={5}>{title}</Heading>
        </Box>
      )}
      <Menu>{children}</Menu>
    </Box>
  );
}

interface MenuItemLinkProps {
  title: string;
  icon?: ReactNode;
  href?: Url;
  showArrow?: boolean;
  isLinkForMainMenu?: boolean;
}

export function MenuItemLink({ href, title, icon, isLinkForMainMenu = true }: MenuItemLinkProps) {
  const router = useRouter();
  const breakpoints = useBreakpoints(true);

  if (!href) {
    return (
      <StyledMenuItemLinkBox>
        <Unavailable>
          <AsideTitle title={title} />
        </Unavailable>
      </StyledMenuItemLinkBox>
    );
  }

  const isActive = isActivePath(router, href);

  return (
    <StyledMenuItemLinkBox>
      <Link href={href} passHref>
        <StyledAnchor isActive={breakpoints.md && isActive} isLinkForMainMenu={isLinkForMainMenu} aria-current={isActive ? 'page' : undefined}>
          <AsideTitle icon={icon} title={title} showArrow={!breakpoints.md || !isActive} />
        </StyledAnchor>
      </Link>
    </StyledMenuItemLinkBox>
  );
}

function isActivePath(router: NextRouter, href: Url) {
  const currentPath = (router.asPath || '/').split('?')[0];
  const hrefPath = resolveHref(router, href).split('?')[0];
  return currentPath === hrefPath;
}

function isCurrentRouteArchivedPage(router: NextRouter, archivedPaths: ArchivedPath) {
  const currentPath = (router.asPath || '/').split('?')[0];
  const code = String(router.query.code);

  if (currentPath.includes('landelijk')) {
    return Object.values(archivedPaths.nl).some((archivedPathFunction) => archivedPathFunction() === currentPath);
  }

  if (currentPath.includes('gemeente')) {
    return Object.values(archivedPaths.gm).some((archivedPathFunction) => archivedPathFunction(code) === currentPath);
  }

  if (currentPath.includes('verantwoording')) {
    return Object.values(archivedPaths.dataExplained).some((archivedPathFunction) => archivedPathFunction() === currentPath);
  }

  return false;
}

const Unavailable = styled.span(
  css({
    display: 'block',
    padding: space[2],
    color: colors.gray5,

    svg: {
      fill: 'currentColor',
    },
  })
);

const StyledAnchor = styled(Anchor)<{ isActive: boolean; isLinkForMainMenu: boolean }>((anchorProps) =>
  css({
    padding: space[2],
    paddingLeft: anchorProps.isLinkForMainMenu ? '3rem' : '0.5rem',
    display: 'block',
    borderRight: '5px solid transparent',
    color: anchorProps.isActive ? colors.blue8 : 'black',
    fontWeight: anchorProps.isActive ? 'bold' : 'normal',
    position: 'relative',
    bg: anchorProps.isActive ? 'blue1' : 'transparent',
    borderRightColor: anchorProps.isActive ? colors.blue8 : 'transparent',

    '&:hover, &:focus': {
      bg: 'blue8',
      color: colors.white,
      fontWeight: 'bold',
      svg: {
        color: colors.white,
      },
    },

    '&::after': {
      content: anchorProps.isActive ? 'none' : asResponsiveArray({ _: 'none', xs: undefined }),
      backgroundImage: `url('${chevronUrl}')`,
      // match aspect ratio of chevron.svg
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: space[3],
      top: '1.35em',
    },
  })
);

const StyledMenuItemLinkBox = styled.li`
  list-style-type: none;

  li:last-child div {
    margin: 0;
  }
`;

const Icon = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      role="img"
      aria-hidden="true"
      flex="0 0 auto"
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      justifyContent="center"
      alignItems="center"
      padding="0"
      marginRight="0"
      marginTop="-3px"
      css={css({
        width: '2.5rem',
        height: '2.5rem',
        svg: {
          height: '2.25rem',
          fill: 'currentColor',
        },
      })}
    >
      {children}
    </Box>
  );
};
