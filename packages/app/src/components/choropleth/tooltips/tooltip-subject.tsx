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

export function TooltipSubject({
  subject,
  thresholdValues,
  filterBelow,
  children,
  noDataFillColor,
}: TooltipSubjectProps) {
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
        m={0}
        spacingHorizontal={2}
        css={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'pre-wrap',
        })}
      >
        {children}
        <Box
          flexShrink={0}
          height={13}
          width={13}
          borderRadius={'2px'}
          ml={'auto'}
          mb={'auto'}
          mt={'5px'}
          backgroundColor={color}
        />
      </Box>
    </Box>
  );
}
