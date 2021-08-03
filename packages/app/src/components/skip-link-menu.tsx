import css from '@styled-system/css';
import styled from 'styled-components';
import { Anchor } from './typography';

export function SkipLinkMenu({
  ariaLabel,
  links,
}: {
  ariaLabel: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <StyledSkipLinkMenu role="navigation" aria-label={ariaLabel}>
      {links.map((x) => (
        <SkipLink key={x.href} href={x.href}>
          {x.label}
        </SkipLink>
      ))}
    </StyledSkipLinkMenu>
  );
}

const StyledSkipLinkMenu = styled.nav(
  css({
    position: 'absolute',
    zIndex: '100',
    top: '0',
    left: '50%',
    width: '100%',
    transform: 'translateX(-50%)',
  })
);

const SkipLink = styled(Anchor)(
  css({
    position: 'absolute',
    fontSize: 2,
    fontWeight: 'bold',
    width: 'auto',
    px: 4,
    py: 3,
    cursor: 'pointer',
    color: 'white',
    bg: 'blue',
    textDecoration: 'none',
    top: -9999,
    left: -9999,

    '&:focus': {
      position: 'absolute',
      outline: '2px dotted white',
      outlineOffset: '-2px',
      top: 2,
      left: 2,
    },
  })
);
