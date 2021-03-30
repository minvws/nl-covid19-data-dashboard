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
import { Title } from './title';
import { asResponsiveArray } from '~/style/utils';

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

type buttonVariantType = 'top' | 'bottom' | 'default';
interface MetricMenuItemLinkProps {
  title: string;
  icon?: ReactNode;
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
      <Title icon={icon} title={title} subtitle={subtitle} />
      {children && (
        <Box mx={icon ? '2.5em' : 0}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Box>
      )}
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

interface MetricMenuButtonProps {
  title: string;
  href: Url;
  subtitle?: string;
  children?: ReactNode;
  buttonVariant?: buttonVariantType;
}

export function MetricMenuButtonLink({
  title,
  subtitle,
  children,
  href,
  buttonVariant = 'default',
}: MetricMenuButtonProps) {
  const router = useRouter();
  const isActive = isActivePath(router, href);

  const content = (
    <>
      <Title title={title} subtitle={subtitle} />
      {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
    </>
  );

  return (
    <MetricMenuButton isActive={isActive} buttonVariant={buttonVariant}>
      <Link href={href} passHref>
        <StyledLink isButton={true} isActive={isActive}>
          {content}
        </StyledLink>
      </Link>
    </MetricMenuButton>
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

const MetricMenuButton = styled.li<{
  buttonVariant: buttonVariantType;
  isActive?: boolean;
}>((x) =>
  css({
    borderRadius: x.buttonVariant === 'default' ? 5 : undefined,
    border: '1px solid',
    borderColor: 'border',

    borderTopLeftRadius: x.buttonVariant === 'top' ? 5 : undefined,
    borderTopRightRadius: x.buttonVariant === 'top' ? 5 : undefined,
    borderBottomLeftRadius: x.buttonVariant === 'bottom' ? 5 : undefined,
    borderBottomRightRadius: x.buttonVariant === 'bottom' ? 5 : undefined,

    borderTop: x.buttonVariant === 'bottom' ? '0px' : undefined,

    mx: 3,
    overflow: 'hidden',
    bg: x.isActive
      ? asResponsiveArray({ _: null, md: '#ebebeb' })
      : 'transparent',
  })
);

const ChildrenWrapper = styled.div(
  css({
    '& > div:not(:first-child)': {
      height: '3.5rem',
      marginTop: '-1.25em',
    },
  })
);

const Unavailable = styled.span(
  css({
    display: 'block',
    padding: 3,
    color: 'gray',

    svg: {
      fill: 'currentColor',
      color: 'gray',
    },
  })
);

const StyledLink = styled.a<{ isActive: boolean; isButton?: boolean }>((x) =>
  css({
    padding: 3,
    display: 'block',
    borderRight: '5px solid transparent',
    color: 'black',
    textDecoration: 'none',
    position: 'relative',

    bg:
      x.isActive && !x.isButton
        ? asResponsiveArray({ _: undefined, md: '#ebebeb' })
        : 'transparent',
    borderRightColor: x.isActive
      ? asResponsiveArray({ _: undefined, md: 'sidebarLinkBorder' })
      : 'transparent',

    '&:hover': {
      bg: 'page',
    },

    '&:focus': {
      bg: '#ebebeb',
    },

    '&::after': {
      content: x.isActive
        ? 'none'
        : asResponsiveArray({ _: 'none', xs: undefined }),
      backgroundImage: `url('/images/chevron.svg')`,
      // match aspect ratio of chevron.svg
      backgroundSize: '0.6em 1.2em',
      height: '1.2em',
      width: '0.6em',
      display: 'block',
      position: 'absolute',
      right: 3,
      top: '1.35em',
    },
  })
);
