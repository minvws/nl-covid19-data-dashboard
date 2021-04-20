import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';

interface TooltipSubjectProps {
  subject: string;
  thresholdValues: ChoroplethThresholdsValue[];
  filterBelow: number;
  children: ReactNode;
}

export function TooltipSubject(props: TooltipSubjectProps) {
  const { subject, thresholdValues, filterBelow, children } = props;

  const filteredThreshold = getFilteredThresholdValues(
    thresholdValues,
    filterBelow
  );

  return (
    <>
      <Text m={0} mb={1} fontWeight="bold">
        {subject}
      </Text>
      <Text
        m={0}
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
          backgroundColor={filteredThreshold.color}
        />
      </Text>
    </>
  );
}
