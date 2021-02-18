import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import { ReactNode } from 'react';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';

interface TooltipSubjectProps {
  subject: string;
  thresholdValues: ChoroplethThresholdsValue[];
  filterBelow: number;
  children: ReactNode;
}

export function TooltipSubject(props: TooltipSubjectProps) {
  const { subject, thresholdValues, filterBelow, children } = props;

  // Get all the thresholds and filter out the right color that needs to be rendered in the rectangle,
  // by filtering out all the higher thresholds and then using the last key that still exists.
  const filteredThreshold = thresholdValues
    .filter((item: ChoroplethThresholdsValue) => {
      return item.threshold <= filterBelow;
    })
    .slice(-1)[0];

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
