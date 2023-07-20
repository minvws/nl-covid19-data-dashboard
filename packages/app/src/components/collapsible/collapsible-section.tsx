import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '~/components/base';
import { isAtBottomOfPage } from '~/utils/is-at-bottom-of-page';
import { isElementAtTopOfViewport } from '~/utils/is-element-at-top-of-viewport';
import { useCollapsible } from '~/utils/use-collapsible';
import { Anchor } from '../typography';
import { colors } from '@corona-dashboard/common';
import { fontSizes, fontWeights, space } from '~/style/theme';

interface CollapsibleSectionProps extends BoxProps {
  summary: string;
  children: ReactNode;
  className?: string;
  id?: string;
  hideBorder?: boolean;
  fontSize?: string;
  textColor?: string;
  borderColor?: string;
}

export const CollapsibleSection = ({
  summary,
  children,
  id,
  hideBorder,
  textColor = colors.blue8,
  fontSize = fontSizes[5],
  borderColor = colors.gray2,
  className,
}: CollapsibleSectionProps) => {
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
    <Box as="section" borderTop={hideBorder ? undefined : `1px solid ${borderColor}`} id={id} ref={section} className={`${className} ${collapsible.isOpen ? 'open' : ''}`}>
      <Summary color={textColor} onClick={() => collapsible.toggle()} fontSize={fontSize}>
        <Box width="100%" position="relative">
          {summary}
          {id && (
            <StyledAnchor aria-hidden="true" tabIndex={-1} onClick={(event) => event.stopPropagation()} href={`#${id}`}>
              #
            </StyledAnchor>
          )}
        </Box>
        {collapsible.button()}
      </Summary>
      {collapsible.content(<Box paddingX={space[3]}>{children}</Box>)}
    </Box>
  );
};

const StyledAnchor = styled(Anchor)`
  color: ${colors.gray2};
  left: -48px;
  padding: 0 ${space[3]};
  position: absolute;
  text-decoration: none;
  top: 50%;
  transform: translateY(-50%);
  width: 0;

  &:hover,
  &:focus {
    color: ${colors.blue1};
  }
`;

const Summary = styled(Box)`
  align-items: center;
  cursor: pointer;
  display: flex;
  font-weight: ${fontWeights.bold};
  justify-content: space-between;
  padding: ${space[3]};
  user-select: none;

  &:focus {
    outline: 1px dashed ${colors.blue8};
  }

  ${StyledAnchor} {
    opacity: 0;
  }

  &:hover,
  &:focus {
    ${StyledAnchor} {
      opacity: 1;
    }
  }
`;
