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
  singleWord?: boolean;
}

export function LinkWithIcon({
  href,
  icon,
  children,
  iconPlacement = 'left',
  fontWeight = 'normal',
  headingLink,
}: LinkWithIconProps) {
  const splittedString = children.split(' ');
  const firstWords = `${splittedString.slice(0, -1).join(' ')} `;
  const singleWord = splittedString.length === 1;

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
        {iconPlacement == 'right' && !headingLink && (
          <>
            {!splittedString.length ? children : firstWords}
            <Box as="span" display="inline-block">
              {splittedString[splittedString.length - 1]}
              <IconSmall icon={icon} />
            </Box>
          </>
        )}
        {iconPlacement == 'left' && !headingLink && (
          <Box as="span">
            <IconSmall icon={icon} />
            {children}
          </Box>
        )}
        {headingLink && (
          <Box paddingRight={singleWord ? `calc(0.5rem + 18px)` : ''}>
            {!splittedString.length ? children : firstWords}
            <span css={css({ display: 'inline-block' })}>
              {splittedString[splittedString.length - 1]}
              <IconLarge icon={icon} singleWord={singleWord} />
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

  function IconLarge({ icon, singleWord }: IconProps) {
    return (
      <span
        css={css({
          svg: {
            height: '16px',
            width: '18px',
            marginLeft: 2,
            position: singleWord ? 'absolute' : 'relative',
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
