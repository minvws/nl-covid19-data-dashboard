import { colors } from '@corona-dashboard/common';
import { useIntl } from '~/intl';
import { fontSizes, space } from '~/style/theme';
import { FAQuestionAndAnswer } from '~/types/cms';
import { Box } from './base/box';
import { ChartTile } from './chart-tile';
import { RichContent } from './cms/rich-content';
import { CollapsibleSection } from './collapsible';
import styled from 'styled-components';

interface PageFaqTileProps {
  questions: FAQuestionAndAnswer[];
  title: string;
}

export const PageFaqTile = ({ questions, title }: PageFaqTileProps) => {
  const { commonTexts } = useIntl();

  return (
    <ChartTile title={title ?? commonTexts.faq.title} id="veelgestelde-vragen" disableFullscreen>
      {questions.map((question, index) => (
        <StyledCollapsibleSection key={index} summary={question.title} textColor={colors.black} fontSize={fontSizes[3]} isLast={index + 1 === questions.length}>
          {question.content && (
            <Box paddingBottom={space[3]}>
              <RichContent blocks={question.content} />
            </Box>
          )}
        </StyledCollapsibleSection>
      ))}
    </ChartTile>
  );
};

const StyledCollapsibleSection = styled(CollapsibleSection)<{ isLast: boolean }>`
  border-bottom: ${({ isLast }) => (isLast ? `1px solid ${colors.gray2}` : undefined)};
`;
