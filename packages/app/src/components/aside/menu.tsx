import css from '@styled-system/css';
import {
  NextRouter,
  resolveHref,
} from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { SpaceValue } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { Box } from '../base';
import { Anchor, Text } from '../typography';
import { AsideTitle } from './title';

type Url = UrlObject | string;

export function Menu({
  children,
  spacing,
}: {
  children: ReactNode;
  spacing?: SpaceValue;
}) {
  return (
    <Box as="ul" css={css({ listStyle: 'none' })} spacing={spacing}>
      {children}
    </Box>
  );
}

export function CategoryMenu({
  title,
  children,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <Box as="li" spacing={3}>
      {title && (
        <Box px={3} pt={3}>
          <Text variant="h3">{title}</Text>
        </Box>
      )}
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
  showArrow?: boolean;
}

export function MetricMenuItemLink({
  href,
  icon,
  title,
  subtitle,
  children,
  showArrow,
}: MetricMenuItemLinkProps) {
  const router = useRouter();

  const content = (
    <>
      <AsideTitle
        icon={icon}
        title={title}
        subtitle={subtitle}
        showArrow={showArrow}
      />
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
        <StyledAnchor isActive={isActive}>{content}</StyledAnchor>
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

  return (
    <MetricMenuButton isActive={isActive} buttonVariant={buttonVariant}>
      <Link href={href} passHref>
        <StyledAnchor isButton={true} isActive={isActive}>
          <AsideTitle title={title} subtitle={subtitle} />
          {children && <ChildrenWrapper>{children}</ChildrenWrapper>}
        </StyledAnchor>
      </Link>
    </MetricMenuButton>
  );
}

function isActivePath(router: NextRouter, href: Url) {
  const currentPath = (router.asPath || '/').split('?')[0];
  const hrefPath = resolveHref(router, href).split('?')[0];

  return currentPath === hrefPath;
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

const StyledAnchor = styled(Anchor)<{ isActive: boolean; isButton?: boolean }>(
  (x) =>
    css({
      p: 3,
      py: x.isButton ? 3 : undefined,
      pr: x.isButton ? 0 : undefined,
      display: 'block',
      borderRight: '5px solid transparent',
      color: 'black',
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
