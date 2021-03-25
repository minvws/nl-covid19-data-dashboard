import css from '@styled-system/css';
import styled from 'styled-components';
import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';

interface AgeGroupLegendProps {
  seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[];
  ageGroupSelection: string[];
  onToggleAgeGroup: (ageGroupRange: string) => void;
  onReset: () => void;
}

export function AgeGroupLegend({
  seriesConfig,
  ageGroupSelection,
  onToggleAgeGroup,
  onReset,
}: AgeGroupLegendProps) {
  return (
    <>
      <List>
        {seriesConfig.map((item, i) => {
          return (
            <Item key={i}>
              <button onClick={() => onToggleAgeGroup(item.metricProperty)}>
                {item.label}
                {ageGroupSelection.includes(item.metricProperty)
                  ? ' SELECTED'
                  : '-'}
                <Line color={item.color} />
              </button>
            </Item>
          );
        })}
      </List>
      <button disabled={ageGroupSelection.length === 0} onClick={onReset}>
        RESET!
      </button>
    </>
  );
}

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
  })
);

const Item = styled.li(
  css({
    my: 1,
    mr: 3,
    position: 'relative',
    display: 'inline-block',
    pl: '25px', // alignment with shape
  })
);

const Shape = styled.div<{ color: string }>((x) =>
  css({
    content: '',
    display: 'block',
    position: 'absolute',
    left: 0,
    backgroundColor: x.color,
  })
);

const Line = styled(Shape)(
  css({
    top: '10px',
    width: '15px',
    height: '3px',
    borderRadius: '2px',
  })
);
