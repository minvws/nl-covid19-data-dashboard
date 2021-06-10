import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';

interface TooltipSubjectProps {
  subject?: string;
  thresholdValues: ChoroplethThresholdsValue[];
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
    filterBelow === null
      ? noDataFillColor || getFilteredThresholdValues(thresholdValues, 0).color
      : getFilteredThresholdValues(thresholdValues, filterBelow).color;

  return (
    <>
      {subject && (
        <Text m={0} mb={1} fontWeight="bold">
          {subject}
        </Text>
      )}
      <Box
        m={0}
        spacing={2}
        spacingHorizontal
        css={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'pre-wrap',
        })}
      >
        {children}
        <Box
          height={13}
          width={13}
          borderRadius={'2px'}
          ml={'auto'}
          backgroundColor={color}
        />
      </Box>
    </>
  );
}
