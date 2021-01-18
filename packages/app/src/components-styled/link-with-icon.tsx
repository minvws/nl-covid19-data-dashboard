import css from '@styled-system/css';
import { ReactNode } from 'react';
import { UrlObject } from 'url';
import { Link } from '~/utils/link';

interface LinkWithIconProps {
  href: UrlObject | string;
  children: ReactNode;
  icon: ReactNode;
  iconPlacement?: 'left' | 'right';
  fontWeight?: 'bold' | 'normal';
}

export function LinkWithIcon({
  href,
  icon,
  children,
  iconPlacement = 'left',
  fontWeight = 'normal',
}: LinkWithIconProps) {
  return (
    <Link href={href} passHref>
      <a
        css={css({
          display: 'inline-block',
          fontWeight: fontWeight ?? 'normal',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
        })}
      >
        {iconPlacement == 'right' && children}
        <span
          css={css({
            svg: {
              height: '10px',
              width: '12px',
              marginRight: 3,
            },
          })}
        >
          {icon}
        </span>
        {iconPlacement == 'left' && children}
      </a>
    </Link>
  );
}
