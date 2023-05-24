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
  id?: string;
  textColor?: string;
  borderColor?: string;
  border?: string;
  borderRadius?: string;
  marginBottom?: string;
}

export const CollapsibleSection = ({
  summary,
  children,
  id,
  textColor = colors.blue8,
  borderColor = colors.gray2,
  border,
  borderRadius,
  marginBottom,
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
    <Box as="section" borderTop={`1px solid ${borderColor}`} id={id} ref={section} border={border} borderRadius={borderRadius} marginBottom={marginBottom}>
      <StyledSummary textColor={textColor} onClick={() => collapsible.toggle()}>
        <Box width="100%" position="relative">
          {summary}
          {id && (
            <StyledAnchor aria-hidden="true" tabIndex={-1} onClick={(event) => event.stopPropagation()} href={`#${id}`}>
              #
            </StyledAnchor>
          )}
        </Box>
        {collapsible.button()}
      </StyledSummary>
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

interface SummaryProps {
  textColor: string;
}

const StyledSummary = styled(Box)<SummaryProps>`
  align-items: center;
  color: ${({ textColor }) => textColor};
  cursor: pointer;
  display: flex;
  font-size: ${fontSizes[5]};
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
