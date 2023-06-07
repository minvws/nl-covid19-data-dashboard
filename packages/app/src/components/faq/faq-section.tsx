import { colors } from '@corona-dashboard/common';
import { fontSizes, fontWeights, radii, space } from '~/style/theme';
import { FAQuestionAndAnswer } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skip-links';
import { Box } from '../base/box';
import { RichContent } from '../cms/rich-content';
import { Heading } from '../typography';
import { CollapsibleSection } from '../collapsible/collapsible-section';
import styled from 'styled-components';

interface FaqSectionProps {
  section: [string, [FAQuestionAndAnswer, ...FAQuestionAndAnswer[]]][];
}

export const FaqSection = ({ section }: FaqSectionProps) => {
  return (
    <Box as="section" flexBasis="50%" spacing={4}>
      {section.map(([group, questions]) => (
        <Box as="article" key={group} spacing={3}>
          <Heading level={3} as="h2">
            {group}
          </Heading>

          {questions.map((item) => {
            const id = getSkipLinkId(item.title);
            return (
              <StyledCollapsibleSection key={id} id={id} summary={item.title} hideBorder>
                {item.content && (
                  <Box paddingY={space[3]}>
                    <RichContent blocks={item.content} />
                  </Box>
                )}
              </StyledCollapsibleSection>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

const StyledCollapsibleSection = styled(CollapsibleSection)`
  border: 1px solid ${colors.gray2};
  border-radius: ${radii[1]}px;
  margin-bottom: ${space[2]};

  &:hover {
    background: ${colors.gray1};
    border-color: ${colors.blue8};
  }

  &.open {
    background: ${colors.white};
    border: 1px solid ${colors.blue8};
  }

  ${Box} {
    font-size: ${fontSizes[2]};
    font-weight: ${fontWeights.normal};
  }
`;
