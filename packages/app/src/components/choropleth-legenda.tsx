import { ChoroplethThresholdsValue } from '@corona-dashboard/common';
import { css } from '@styled-system/css';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { ValueAnnotation } from '~/components/value-annotation';
import { Box } from './base';
import { Heading } from './typography';

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
  const { width = 0, ref } = useResizeObserver<HTMLSpanElement>();

  return (
    <Box width="100%" pr={`${width / 2}px`}>
      {title && <Heading level={4}>{title}</Heading>}
      <List
        aria-label="legend"
        hasValueAnnotation={valueAnnotation ? true : false}
      >
        {thresholds.map(({ color, threshold, label, endLabel }, index) => {
          const isFirst = index === 0;
          const isLast = index === thresholds.length - 1;
          return (
            <Item key={color + threshold}>
              <LegendaColor color={color} first={isFirst} last={isLast} />
              {isFirst ? (
                <StartLabel>{label ?? threshold}</StartLabel>
              ) : (
                <Label>{label ?? threshold}</Label>
              )}

              {isLast && endLabel && <EndLabel ref={ref}>{endLabel}</EndLabel>}
            </Item>
          );
        })}
      </List>
      <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
    </Box>
  );
}

const List = styled.ul<{ hasValueAnnotation?: boolean }>((x) =>
  css({
    width: '100%',
    marginTop: 0,
    paddingLeft: 0,
    listStyle: 'none',
    display: 'flex',
    mb: x.hasValueAnnotation ? 2 : 0,
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

const Label = styled.span<{ alignRight?: boolean }>(
  css({
    pt: 1,
    display: 'inline-block',
    transform: 'translateX(-50%)',
    fontSize: [0, null, 1],
  })
);

const StartLabel = styled(Label)(
  css({
    transform: 'translateX(0)',
  })
);

const EndLabel = styled(Label)(
  css({
    position: 'absolute',
    top: 10,
    right: 0,
    transform: 'translateX(50%)',
  })
);
