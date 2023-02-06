import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { isDefined, isPresent } from 'ts-is-present';
import { Box } from '~/components/base';
import { BoldText } from '~/components/typography';
import { getThresholdValue } from '~/utils/get-threshold-value';

interface TooltipSubjectProps {
  subject?: string;
  thresholdValues?: ChoroplethThresholdsValue[];
  filterBelow: number | null;
  children: ReactNode;
  noDataFillColor?: string;
}

export function TooltipSubject({ subject, thresholdValues, filterBelow, children, noDataFillColor }: TooltipSubjectProps) {
  const color =
    !isPresent(filterBelow) && isDefined(thresholdValues)
      ? noDataFillColor || getThresholdValue(thresholdValues, 0).color
      : isPresent(filterBelow) && isDefined(thresholdValues)
      ? getThresholdValue(thresholdValues, filterBelow).color
      : noDataFillColor;

  return (
    <Box spacing={1}>
      {subject && <BoldText>{subject}</BoldText>}
      <Box
        margin="0"
        spacingHorizontal={2}
        display="flex"
        alignItems="center"
        flexWrap="nowrap"
        css={css({
          whiteSpace: 'pre-wrap',
        })}
      >
        {children}
        <Box flexShrink={0} height="13px" width="13px" borderRadius="2px" marginLeft="auto" marginBottom="auto" marginTop="5px" backgroundColor={color} />
      </Box>
    </Box>
  );
}
