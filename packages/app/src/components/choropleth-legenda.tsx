import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css, SystemStyleObject } from '@styled-system/css';
import styled from 'styled-components';
import { ValueAnnotation } from '~/components/value-annotation';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { Box } from './base';
import { Text } from './typography';

interface ChoroplethLegendaProps {
  title: string;
  thresholds: ChoroplethThresholdsValue[];
  valueAnnotation?: string;
}

export function ChoroplethLegenda({
  title,
  thresholds,
  valueAnnotation,
}: ChoroplethLegendaProps) {
  const [itemRef, itemSize] = useResizeObserver<HTMLLIElement>();
  const [endLabelRef, endLabelSize] = useResizeObserver<HTMLSpanElement>();

  return (
    <Box width="100%" pr={`${endLabelSize.width ?? 0 / 2}px`} spacing={2}>
      {title && <Text variant="subtitle1">{title}</Text>}
      <List>
        {thresholds.map(({ color, threshold, label, endLabel }, index) => {
          const isFirst = index === 0;
          const isLast = index === thresholds.length - 1;
          const displayLabel = (itemSize.width ?? 0) > 35 || index % 2 === 0;

          return (
            <Item
              key={color + threshold}
              ref={index === 0 ? itemRef : undefined}
            >
              <LegendaColor color={color} first={isFirst} last={isLast} />
              {isFirst ? (
                <StartLabel>{label ?? threshold}</StartLabel>
              ) : (
                displayLabel && <Label>{label ?? threshold}</Label>
              )}

              {isLast && endLabel && (
                <EndLabel ref={endLabelRef}>{endLabel}</EndLabel>
              )}
            </Item>
          );
        })}
      </List>
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
