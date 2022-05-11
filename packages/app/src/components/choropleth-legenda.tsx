import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css, SystemStyleObject } from '@styled-system/css';
import styled from 'styled-components';
import { ValueAnnotation } from '~/components/value-annotation';
import { useIntl } from '~/intl';
import { replaceVariablesInText } from '~/utils';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from './base';
import { Legend, LegendItem } from './legend';
import { Text } from './typography';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
  valueAnnotation?: string;
  type?: 'default' | 'bar';
}

export function ChoroplethLegenda({
  title,
  thresholds,
  valueAnnotation,
  type = 'bar',
}: ChoroplethLegendaProps) {
  const [itemRef, itemSize] = useResizeObserver<HTMLLIElement>();
  const [endLabelRef, endLabelSize] = useResizeObserver<HTMLSpanElement>();
  const { commonTexts, formatNumber } = useIntl();
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
    <Box
      width="100%"
      pr={`${endLabelSize.width ?? 0 / 2}px`}
      spacing={2}
      aria-hidden="true"
    >
      {title && <Text variant="subtitle1">{title}</Text>}
      {'bar' === type ? (
        <List>
          {thresholds.map(({ color, threshold, label, endLabel }, index) => {
            const isFirst = index === 0;
            const isLast = index === thresholds.length - 1;
            const displayLabel = (itemSize.width ?? 0) > 35 || index % 2 === 0;
            const formattedTreshold = formatNumber(threshold);

            return (
              <Item
                key={color + threshold}
                ref={index === 0 ? itemRef : undefined}
              >
                <LegendaColor color={color} first={isFirst} last={isLast} />
                {isFirst ? (
                  <StartLabel>{label ?? formattedTreshold}</StartLabel>
                ) : (
                  displayLabel && <Label>{label ?? formattedTreshold}</Label>
                )}

                {isLast && endLabel && (
                  <EndLabel ref={endLabelRef}>{endLabel}</EndLabel>
                )}
              </Item>
            );
          })}
        </List>
      ) : (
        <Legend items={legendItems} columns={breakpoints.md ? 1 : 2} />
      )}
      <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
    </Box>
  );
}

const List = styled.ul(
  css({
    width: '100%',
    marginTop: 0,
    paddingLeft: 0,
    listStyle: 'none',
    display: 'flex',
  })
);

const Item = styled.li(
  css({
    flex: 1,
    position: 'relative',
  })
);

const LegendaColor = styled.div<{
  first?: boolean;
  last?: boolean;
  color: string;
}>((x) =>
  css({
    width: '100%',
    height: '10px',
    flexGrow: 0,
    flexShrink: 0,
    borderRadius: x.first ? '2px 0 0 2px' : x.last ? '0 2px 2px 0' : 0,
    backgroundColor: x.color,
  })
);

const labelStyles: SystemStyleObject = {
  pt: 1,
  display: 'inline-block',
  transform: 'translateX(-50%)',
  fontSize: [0, null, 1],
};

const Label = styled.span(css(labelStyles));

const StartLabel = styled.span(
  css({
    ...labelStyles,
    transform: 'translateX(0)',
  })
);

const EndLabel = styled.span(
  css({
    ...labelStyles,
    position: 'absolute',
    top: [12, null, 10],
    right: 0,
    transform: 'translateX(50%)',
  })
);
