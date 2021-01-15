import { Link } from '~/utils/link';
import { ReactNode } from 'react';
import css from '@styled-system/css';
import { UrlObject } from 'url';

interface LinkWithIconProps {
  href: UrlObject | string;
  children: ReactNode;
  icon: ReactNode;
}

export function LinkWithIcon({ href, icon, children }: LinkWithIconProps) {
  return (
    <Link href={href} passHref>
      <a
        css={css({
          display: 'inline-block',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        })}
      >
        <span
          css={css({
            svg: {
              height: '10px',
              width: '12px',
              transform: 'rotate(90deg)',
              marginRight: 3,
            },
          })}
        >
          {icon}
        </span>
        {children}
      </a>
    </Link>
  );
}
