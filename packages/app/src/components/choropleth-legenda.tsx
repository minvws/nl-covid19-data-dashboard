import { ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import styled from 'styled-components';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { space, fontSizes } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { Box } from './base';
import { Legend, LegendItem } from './legend';
import { InlineText, Text } from './typography';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
  valueAnnotation?: string;
  type?: 'default' | 'bar';
  pageType?: string;
  outdatedDataLabel?: string;
}

export function ChoroplethLegenda({ title, thresholds, valueAnnotation, pageType, outdatedDataLabel }: ChoroplethLegendaProps) {
  const { commonTexts } = useIntl();
  const legendItems = thresholds.map(
    (x: ChoroplethThresholdsValue, i) =>
      ({
        label: thresholds[i + 1]
          ? replaceVariablesInText(commonTexts.common.value_until_value, {
              value_1: x.threshold,
              value_2: thresholds[i + 1].threshold,
            })
          : replaceVariablesInText(commonTexts.common.value_and_higher, {
              value: x.threshold,
            }),
        shape: 'square',
        color: x.color,
      } as LegendItem)
  );

  return (
    <Box width="100%" spacing={2} aria-hidden="true">
      {title && <Text variant="subtitle1">{title}</Text>}

      <Legend items={legendItems} columns={2} />

      {pageType === 'sewer' && (
        <Box display="flex" alignItems="center" paddingBottom={space[2]}>
          <LegendaColor first={true} width={`${100 / thresholds.length}%`} color={colors.yellow1} />
          <Box paddingLeft={space[3]} fontSize={fontSizes[1]}>
            <InlineText>{outdatedDataLabel}</InlineText>
          </Box>
        </Box>
      )}
      <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
    </Box>
  );
}

const LegendaColor = styled.div<{
  first?: boolean;
  last?: boolean;
  width?: string;
  color: string;
}>((x) =>
  css({
    width: '100%',
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: x.width,
    borderRadius: x.first ? '2px 0 0 2px' : x.last ? '0 2px 2px 0' : 0,
    backgroundColor: x.color,
  })
);
