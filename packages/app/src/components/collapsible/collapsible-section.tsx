import { css } from '@styled-system/css';
import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/base';
import { useCollapsible } from '~/utils/use-collapsible';
import { Anchor } from '../typography';

interface CollapsibleSectionProps extends BoxProps {
  summary: string;
  children: ReactNode;
  id?: string;
  hideBorder?: boolean;
}

export const CollapsibleSection = ({
  summary,
  children,
  id,
  hideBorder,
}: CollapsibleSectionProps) => {
  const collapsible = useCollapsible();
  const { toggle } = collapsible;

  useEffect(() => {
    /**
     * Checks the hash part of the URL to see if it matches the id.
     * If so, the collapsible needs to be opened.
     */
    function handleHashChange() {
      if (id && window.location.hash === `#${id}`) {
        const sectionElement = document.getElementById(id);
        if (!sectionElement) return;

        let shouldToggle = false;
        const interval = setInterval(() => {
          const isElementAtTopOfViewport =
            sectionElement.getBoundingClientRect().top <= 1;
          const isElementAtBottomOfViewport =
            window.innerHeight + Math.round(window.scrollY) >=
            document.body.scrollHeight;
          if (isElementAtTopOfViewport || isElementAtBottomOfViewport) {
            shouldToggle = true;
          }

          if (shouldToggle) {
            toggle(true);

            clearInterval(interval);
            return;
          }
        }, 250);
      }
    }

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [toggle, id]);

  return (
    <Box
      as="section"
      borderTop={hideBorder ? undefined : '1px solid'}
      borderTopColor={hideBorder ? undefined : 'lightGray'}
      id={id}
    >
      {collapsible.button(
        <Summary>
          <Box width="100%">
            {summary}
            {id && (
              <StyledAnchor
                aria-hidden="true"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
                href={`#${id}`}
                id={`${id}-anchor`}
              >
                #
              </StyledAnchor>
            )}
          </Box>
          {collapsible.chevron}
        </Summary>
      )}

      {collapsible.content(<Box px={3}>{children}</Box>)}
    </Box>
  );
};

const StyledAnchor = styled(Anchor)(
  css({
    color: 'lightGray',
    px: 3,
    py: 1,
    width: 0,
    textDecoration: 'none',
    position: 'absolute',
    right: '100%',
    '&:hover, &:focus': {
      color: 'blue',
    },
  })
);

const Summary = styled.button(
  css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'visible',
    width: '100%',
    m: 0,
    p: 3,
    bg: 'transparent',
    border: 'none',
    color: 'blue',
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    textAlign: 'left',
    position: 'relative',
    cursor: 'pointer',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },

    [StyledAnchor]: { opacity: 0 },

    '&:focus, &:hover': {
      [StyledAnchor]: { opacity: 1 },
    },
  })
);
