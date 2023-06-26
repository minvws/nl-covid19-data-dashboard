import { colors } from '@corona-dashboard/common';
import { fontSizes, space } from '~/style/theme';
import { FAQuestionAndAnswer } from '~/types/cms';
import { Box } from './base/box';
import { ChartTile } from './chart-tile';
import { RichContent } from './cms/rich-content';
import { CollapsibleSection } from './collapsible';

interface PageFaqTileProps {
  questions: FAQuestionAndAnswer[];
}

export const PageFaqTile = ({ questions }: PageFaqTileProps) => {
  return (
    // TODO: create a common Lokalize key for the below text
    <ChartTile title="Veelgestelde vragen" id="veelgestelde-vragen" disableFullscreen>
      {questions.map((question, index) => (
        <CollapsibleSection key={index} summary={question.title} textColor={colors.black} fontSize={fontSizes[3]}>
          {question.content && (
            <Box paddingBottom={space[3]}>
              <RichContent blocks={question.content} />
            </Box>
          )}
        </CollapsibleSection>
      ))}
    </ChartTile>
  );
};
