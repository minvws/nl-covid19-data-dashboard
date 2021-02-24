import css from '@styled-system/css';
import { ReactNode } from 'react';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';
import { Box } from './base';

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
            {children}
            <IconSmall icon={icon} width={11} height={10} />
          </>
        )}
        {iconPlacement === 'left' && !headingLink && (
          <>
            <IconSmall icon={icon} width={11} height={10} />
            {children}
          </>
        )}
        {headingLink && (
          <Box paddingRight={isSingleWord ? `calc(0.5rem + 18px)` : ''}>
            {!words.length ? children : firstWords}
            <span css={css({ display: 'inline-block' })}>
              {words[words.length - 1]}
              <IconLarge
                icon={icon}
                isSingleWord={isSingleWord}
                width={16}
                height={13}
              />
            </span>
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
