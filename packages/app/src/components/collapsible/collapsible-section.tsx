import { css } from '@styled-system/css';
import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/base';
import { isAtBottomOfPage } from '~/utils/is-at-bottom-of-page';
import { isElementAtTopOfViewport } from '~/utils/is-element-at-top-of-viewport';
import { useCollapsible } from '~/utils/use-collapsible';
import { Anchor } from '../typography';
import { colors } from '@corona-dashboard/common';

interface CollapsibleSectionProps extends BoxProps {
  summary: string;
  children: ReactNode;
  id?: string;
  hideBorder?: boolean;
  textColor?: string;
  borderColor?: string;
}

export const CollapsibleSection = ({ summary, children, id, hideBorder, textColor = colors.blue8, borderColor = colors.gray2 }: CollapsibleSectionProps) => {
  const section = useRef<HTMLElement>(null);

  const collapsible = useCollapsible();
  const { toggle } = collapsible;

  useEffect(() => {
    /**
     * Checks the hash part of the URL to see if it matches the id.
     * If so, the collapsible needs to be opened.
     */
    const handleHashChange = () => {
      if (id && window.location.hash === `#${id}`) {
        const sectionElement = section?.current;
        if (!sectionElement) return;

        const interval = setInterval(() => {
          if (isElementAtTopOfViewport(sectionElement) || isAtBottomOfPage()) {
            toggle(true);

            clearInterval(interval);
            return;
          }
        }, 250); // This value is slightly higher than the animation duration of the collapsible section.
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [toggle, id]);

  return (
    <Box as="section" borderTop={hideBorder ? undefined : '1px solid'} borderTopColor={hideBorder ? undefined : borderColor} id={id} ref={section}>
      <Summary textColor={textColor} onClick={() => collapsible.toggle()}>
        <Box width="100%">
          {summary}
          {id && (
            <StyledAnchor aria-hidden="true" tabIndex={-1} onClick={(event) => event.stopPropagation()} href={`#${id}`}>
              #
            </StyledAnchor>
          )}
        </Box>
        {collapsible.button()}
      </Summary>
      {collapsible.content(<Box px={3}>{children}</Box>)}
    </Box>
  );
};

const StyledAnchor = styled(Anchor)(
  css({
    color: colors.gray2,
    px: 3,
    py: 1,
    width: 0,
    textDecoration: 'none',
    position: 'absolute',
    right: '100%',
    '&:hover, &:focus': {
      color: colors.blue1,
    },
  })
);

interface SummaryProps {
  textColor: string;
}
const Summary = styled.div((summaryProps: SummaryProps) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'visible',
    width: '100%',
    margin: 0,
    padding: 3,
    bg: 'transparent',
    border: 'none',
    color: summaryProps.textColor,
    fontFamily: 'body',
    fontWeight: 'bold',
    fontSize: '1.25rem',
    textAlign: 'left',
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',

    '&:focus': {
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: colors.blue8,
    },

    [StyledAnchor]: { opacity: 0 },

    '&:focus, &:hover': {
      [StyledAnchor]: { opacity: 1 },
    },
  })
);
