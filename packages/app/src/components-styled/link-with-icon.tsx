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
          <>
            {!splittedString.length ? children : firstWords}
            <span css={css({ display: 'inline-block' })}>
              {splittedString[splittedString.length - 1]}
              <IconLarge icon={icon} />
            </span>
          </>
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

  function IconLarge({ icon }: IconProps) {
    return (
      <span
        css={css({ svg: { height: '16px', width: '18px', marginLeft: 2 } })}
      >
        {icon}
      </span>
    );
  }

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
        {iconPlacement == 'right' && !headingLink && children}
        {!headingLink && (
          <span
            css={css({
              svg: {
                height: '11px',
                width: '13px',
                mx: '3px',
              },
            })}
          >
            {icon}
          </span>
        )}
        {iconPlacement == 'left' && !headingLink && children}
        {headingLink && (
          <>
            {!splittedString.length
              ? children
              : `${splittedString.slice(0, -1).join(' ')} `}
            <span css={css({ display: 'inline-block' })}>
              {splittedString[splittedString.length - 1]}
              <span
                css={css({
                  svg: { height: '16px', width: '18px', marginLeft: 2 },
                })}
              >
                {icon}
              </span>
            </span>
          </>
        )}
      </a>
    </Link>
  );
}
