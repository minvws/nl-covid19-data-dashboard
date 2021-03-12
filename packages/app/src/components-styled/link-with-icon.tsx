import css from '@styled-system/css';
import { ReactNode } from 'react';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';
import { Box } from './base';
import styled from 'styled-components';

interface LinkWithIconProps {
  href: UrlObject | string;
  children: string;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
  fontWeight?: 'bold' | 'normal';
  headingLink?: boolean | undefined;
}

interface IconProps {
  icon: ReactNode;
  isSingleWord?: boolean;
  width: number;
  height: number;
}

export function LinkWithIcon({
  href,
  icon,
  children,
  iconPlacement = 'left',
  fontWeight = 'normal',
  headingLink,
}: LinkWithIconProps) {
  const words = children.split(' ');
  const firstWords = `${words.slice(0, -1).join(' ')} `;
  const isSingleWord = words.length === 1;

  return (
    <Link href={href} passHref>
      <a
        css={css({
          display: 'inline-block',
          fontWeight,
          position: 'relative',
          textDecoration: 'none',
          color: headingLink ? 'body' : '',
          '&:hover,&:focus': {
            color: headingLink ? 'blue' : '',
            textDecoration: headingLink ? '' : 'underline',
          },
        })}
      >
        {iconPlacement === 'right' && !headingLink && (
          <>
            {!words.length ? children : firstWords}
            <IconWrapper>
              {words[words.length - 1]}
              <IconSmall icon={icon} width={11} height={10} />
            </IconWrapper>
          </>
        )}
        {iconPlacement === 'left' && !headingLink && (
          <>
            {!words.length ? children : firstWords}
            <IconWrapper>
              <IconSmall icon={icon} width={11} height={10} />
              {words[words.length - 1]}
            </IconWrapper>
          </>
        )}
        {headingLink && (
          <Box paddingRight={isSingleWord ? `calc(0.5rem + 18px)` : ''}>
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
        )}
      </a>
    </Link>
  );

  function IconSmall({ icon, width, height }: IconProps) {
    return <span css={css({ svg: { height, width, mx: '3px' } })}>{icon}</span>;
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
}

const IconWrapper = styled.span(
  css({
    display: 'inline-block',
    textDecoration: 'inherit',
  })
);
