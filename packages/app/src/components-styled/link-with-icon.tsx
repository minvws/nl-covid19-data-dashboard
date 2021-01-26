import css from '@styled-system/css';
import { ReactNode } from 'react';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';

interface LinkWithIconProps {
  href: UrlObject | string;
  children: string;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
  fontWeight?: 'bold' | 'normal';
  headingLink?: boolean | undefined;
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
