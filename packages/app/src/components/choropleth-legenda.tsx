import { ChoroplethThresholdsValue, colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { space, fontSizes } from '~/style/theme';
import { replaceVariablesInText } from '~/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { Box } from './base';
import { Legend, LegendItem } from './legend';
import { InlineText, Text } from './typography';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
  valueAnnotation?: string;
  pageType?: string;
  outdatedDataLabel?: string;
}

export function ChoroplethLegenda({ title, thresholds, valueAnnotation, pageType, outdatedDataLabel }: ChoroplethLegendaProps) {
  const { commonTexts } = useIntl();
  const breakpoints = useBreakpoints(true);

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

      <Legend items={legendItems} columns={breakpoints.lg ? 1 : 2} />

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

type LegendaColorProps = {
  first?: boolean;
  last?: boolean;
  width?: string;
  color: string;
};

const LegendaColor = styled.div<LegendaColorProps>`
  width: 100%;
  height: 10px;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: ${({ width }) => (width ? width : 'inherit')};
  border-radius: ${({ first, last }) => (first ? '2px 0 0 2px' : last ? '0 2px 2px 0' : 0)};
  background-color: ${({ color }) => (color ? color : 'inherit')};
`;
