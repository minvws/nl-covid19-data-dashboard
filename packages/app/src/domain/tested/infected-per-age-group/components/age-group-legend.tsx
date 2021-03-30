import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css, { SystemStyleObject } from '@styled-system/css';
import styled from 'styled-components';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';

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
  const { siteText } = useIntl();
  const text = siteText.infected_per_age_group;

  const hasSelection = ageGroupSelection.length !== 0;

  function toggleAgeGroup(metricProperty: string) {
    onToggleAgeGroup(metricProperty);

    /* Without setting focus, the focus is lost on re-render */
    requestAnimationFrame(() => {
      const item: HTMLElement | null = document.querySelector(
        `button[data-metric-property=${metricProperty}]`
      );
      if (item) {
        item.focus();
      }
    });
  }

  return (
    <>
      <Legend>
        <List>
          {seriesConfig.map((item) => {
            const isSelected = ageGroupSelection.includes(item.metricProperty);
            return (
              <Item key={item.label}>
                <ItemButton
                  onClick={() => toggleAgeGroup(item.metricProperty)}
                  isActive={hasSelection && isSelected}
                  color={item.color}
                  data-metric-property={item.metricProperty}
                  data-text={item.label}
                >
                  {item.label}
                  <Line color={item.color} lineStyle={item.style ?? 'solid'} />
                </ItemButton>
              </Item>
            );
          })}
        </List>
        <ResetButton onClick={onReset} isVisible={hasSelection}>
          {text.reset_button_label}
        </ResetButton>
      </Legend>
      <Text fontSize={1}>{text.legend_help_text}</Text>
    </>
  );
}

const Legend = styled.div(
  css({
    display: 'flex',
    alignItems: 'start',
  })
);

const List = styled.ul(
  css({
    listStyle: 'none',
    px: 0,
    m: 0,
  })
);

const Item = styled.li(
  css({
    mb: 2,
    mr: 3,
    position: 'relative',
    display: 'inline-block',
  })
);

/**
 * Styling for this button contains:
 * :before to render the colored line on hover/focus
 * :after to widen the button to avoid font-weight bold jumps
 */
const ItemButton = styled.button<{
  isActive: boolean;
  color: string;
  text?: string;
}>(({ isActive, color }) =>
  css({
    appearance: 'none',
    background: 'tileGray',
    cursor: 'pointer',
    pr: 10,
    pl: 30,
    py: '3px',
    border: '3px solid',
    borderColor: isActive ? color : 'transparent',
    fontWeight: isActive ? 'bold' : 'normal',
    fontFamily: 'inherit',
    position: 'relative',
    outline: 'none',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover,&:focus': {
      '&:before': {
        content: '""',
        background: color,
        height: '3px',
        position: 'absolute',
        left: '-3px',
        right: '-3px',
        bottom: '-3px',
      },
    },
    '&:focus': {
      background: 'lightGray',
    },
    '&:after': {
      content: 'attr(data-text)',
      height: 0,
      visibility: 'hidden',
      overflow: 'hidden',
      userSelect: 'none',
      pointerEvents: 'none',
      fontWeight: 'bold',
      pr: '1px',
    },
  })
);

const ResetButton = styled.button<{ isVisible: boolean }>(({ isVisible }) =>
  css({
    backgroundColor: 'blue',
    color: 'white',
    p: 20,
    py: '6px',
    border: 'none',
    fontFamily: 'inherit',
    ml: 40,
    visibility: isVisible ? 'visible' : 'hidden',
  })
);

const Line = styled.div<{ color: string; lineStyle: 'dashed' | 'solid' }>(
  ({ color, lineStyle }) =>
    css({
      display: 'block',
      position: 'absolute',
      left: 10,
      borderTopColor: color as SystemStyleObject,
      borderTopStyle: lineStyle,
      borderTopWidth: '3px',
      top: '9px',
      width: '15px',
      height: 0,
      borderRadius: '2px',
    })
);
