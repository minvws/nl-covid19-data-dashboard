import css from '@styled-system/css';
import {
  NextRouter,
  resolveHref,
} from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';
import { Box } from '../base';
import { Category } from './category';
import { TitleWithIcon } from './title-with-icon';

type Url = UrlObject | string;

export function Menu({ children }: { children: ReactNode }) {
  return (
    <Box as="ul" m={0} p={0} py={0} css={css({ listStyle: 'none' })}>
      {children}
    </Box>
  );
}

export function CategoryMenu({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box as="li" spacing={3} pt={5}>
      <Category>{title}</Category>
      <Menu>{children}</Menu>
    </Box>
  );
}

const MetricMenuItem = styled.li(
  css({
    borderBottom: '1px solid',
    borderBottomColor: 'border',
    '&:first-child': {
      borderTop: '1px solid',
      borderTopColor: 'border',
    },
  })
);

interface MetricMenuItemLinkProps {
  title: string;
  icon: ReactNode;
  href?: Url;
  subtitle?: string;
  children?: ReactNode;
}

export function MetricMenuItemLink({
  href,
  icon,
  title,
  subtitle,
  children: children,
}: MetricMenuItemLinkProps) {
  const router = useRouter();

  const content = (
    <>
      <TitleWithIcon icon={icon} title={title} subtitle={subtitle} />
      {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
    </>
  );

  if (!href) {
    return (
      <MetricMenuItem>
        <Unavailable>{content}</Unavailable>
      </MetricMenuItem>
    );
  }

  const isActive = isActivePath(router, href);

  return (
    <MetricMenuItem>
      <Link href={href} passHref>
        <StyledLink isActive={isActive}>{content}</StyledLink>
      </Link>
    </MetricMenuItem>
  );
}

function isActivePath(router: NextRouter, href: Url) {
  const currentPath = (router.asPath || '/').split('?')[0];
  const hrefPath = resolveHref(currentPath, href).split('?')[0];

  return currentPath === hrefPath;
}

/**
 * The following css is copied from the layout.scss file, it can be cleaned up
 */

const ChildrenWrapper = styled.div(
  css({
    margin: '0 2.5rem',

    '& > div:not(:first-child)': {
      height: '3.5rem',
      marginTop: '-1.25em',
    },
  })
);

const Unavailable = styled.span(
  css({
    display: 'block',
    padding: '1rem',
    color: 'gray',

    svg: {
      fill: 'currentColor',
      color: 'gray',
    },
  })
);

const StyledLink = styled.a<{ isActive: boolean }>((x) =>
  css({
    padding: '1rem',
    display: 'block',
    borderRight: '5px solid transparent',
    color: 'black',
    textDecoration: 'none',
    position: 'relative',

    bg: x.isActive ? [null, null, null, '#ebebeb'] : 'transparent',
    borderRightColor: x.isActive
      ? [null, null, null, 'sidebarLinkBorder']
      : 'transparent',

    '&:hover': {
      bg: 'page',
    },

    '&:focus': {
      bg: '#ebebeb',
    },

    '&::after': {
      content: x.isActive ? 'none' : ['none', null, null, "''"],
      backgroundImage: `url('/images/chevron.svg')`,
      // match aspect ratio of chevron.svg
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: '1em',
      top: '1.35em',
    },
  })
);
