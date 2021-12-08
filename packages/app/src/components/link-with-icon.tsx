import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';
import { Box } from './base';
import { Anchor } from './typography';

interface LinkWithIconProps {
  href: UrlObject | string;
  children: string;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
  underline?: boolean;
  fontWeight?: 'normal' | 'bold';
}

interface IconProps {
  icon: ReactNode;
  isSingleWord?: boolean;
  width: number;
  height: number;
  mr?: number | string;
}

export function LinkWithIcon({
  href,
  icon,
  children,
  iconPlacement = 'left',
  fontWeight,
}: LinkWithIconProps) {
  const words = children.split(' ');
  const firstWords = `${words.slice(0, -1).join(' ')} `;

  return (
    <Box as="span" display="inline-block" position="relative">
      <Link href={href} passHref locale={false}>
        <Anchor
          underline="hover"
          css={css({
            fontWeight,
          })}
        >
          {iconPlacement === 'right' && (
            <>
              {!words.length ? children : firstWords}
              <IconWrapper>
                {words[words.length - 1]}
                <IconSmall icon={icon} width={11} height={10} />
              </IconWrapper>
            </>
          )}
          {iconPlacement === 'left' && (
            <>
              <IconSmall icon={icon} width={11} height={10} mr={1} />
              {children}
            </>
          )}
        </Anchor>
      </Link>
    </Box>
  );
}

export function HeadingLinkWithIcon({
  href,
  icon,
  children,
  underline,
}: LinkWithIconProps) {
  const words = children.split(' ');
  const firstWords = `${words.slice(0, -1).join(' ')} `;
  const isSingleWord = words.length === 1;

  return (
    <Box as="span" display="inline-block" position="relative">
      <Link href={href} passHref locale={false}>
        <Anchor color="inherit" hoverColor="blue">
          <Box
            paddingRight={isSingleWord ? `calc(0.5rem + 18px)` : ''}
            css={css({
              '&:hover': {
                textDecoration: underline ? 'underline' : undefined,
              },
            })}
          >
            {!words.length ? children : firstWords}
            <IconWrapper>
              {words[words.length - 1]}
              <IconLarge
                icon={icon}
                isSingleWord={isSingleWord}
                width={16}
                height={13}
              />
            </IconWrapper>
          </Box>
        </Anchor>
      </Link>
    </Box>
  );
}

function IconSmall({ icon, width, height, mr }: IconProps) {
  return (
    <span css={css({ marginRight: mr, svg: { height, width, mx: '3px' } })}>
      {icon}
    </span>
  );
}

function IconLarge({ icon, isSingleWord, width, height }: IconProps) {
  return (
    <span
      css={css({
        svg: {
          width,
          height,
          marginLeft: 2,
          position: isSingleWord ? 'absolute' : 'relative',
          minHeight: '100%',
          right: 0,
          top: 0,
        },
      })}
    >
      {icon}
    </span>
  );
}

const IconWrapper = styled.span(
  css({
    display: 'inline-block',
    textDecoration: 'inherit',
  })
);
