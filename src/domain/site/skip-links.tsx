import text from '~/locale/index';
import css from '@styled-system/css';
import styled from 'styled-components';

export function SkipLinks() {
  return (
    <SkipLinkMenu role="navigation" aria-label={text.aria_labels.skip_links}>
      <SkipLink href="#content">{text.skiplinks.inhoud}</SkipLink>
      <SkipLink href="#main-navigation">{text.skiplinks.nav}</SkipLink>
      <SkipLink href="#metric-navigation">{text.skiplinks.metric_nav}</SkipLink>
      <SkipLink href="#footer-navigation">{text.skiplinks.footer_nav}</SkipLink>
    </SkipLinkMenu>
  );
}

const SkipLinkMenu = styled.nav(
  css({
    position: 'absolute',
    zIndex: '100',
    top: '0',
    left: '50%',
    width: '100%',
    transform: 'translateX(-50%)',
  })
);

const SkipLink = styled.a(
  css({
    position: 'absolute',
    fontSize: '1.2em',
    width: 'auto',
    minHeight: '44px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: 'blue',
    textDecoration: 'none',
    top: '-100vh',
    left: '-100vw',

    '&:focus': {
      position: 'absolute',
      outline: '2px dotted white',
      outlineOffset: '-2px',
      top: 2,
      left: 2,
    },
  })
);
