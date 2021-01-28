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
            <Box as="span" display="inline-block">
              {words[words.length - 1]}
              <IconSmall icon={icon} />
            </Box>
          </>
        )}
        {iconPlacement === 'left' && !headingLink && (
          <Box as="span">
            <IconSmall icon={icon} />
            {children}
          </Box>
        )}
        {headingLink && (
          <Box paddingRight={isSingleWord ? `calc(0.5rem + 18px)` : ''}>
            {!words.length ? children : firstWords}
            <span css={css({ display: 'inline-block' })}>
              {words[words.length - 1]}
              <IconLarge icon={icon} isSingleWord={isSingleWord} />
            </span>
          </Box>
        )}
      </a>
    </Link>
  );

  function IconSmall({ icon }: IconProps) {
    return (
      <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
        {icon}
      </span>
    );
  }

  function IconLarge({ icon, isSingleWord }: IconProps) {
    return (
      <span
        css={css({
          svg: {
            height: '16px',
            width: '18px',
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
