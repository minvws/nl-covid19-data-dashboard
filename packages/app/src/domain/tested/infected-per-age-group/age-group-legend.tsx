import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css, { SystemStyleObject } from '@styled-system/css';
import styled from 'styled-components';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { useIntl } from '~/intl';

interface AgeGroupLegendProps {
  seriesConfig: (LineSeriesDefinition<NlTestedPerAgeGroupValue> & {
    isSelected: boolean;
  })[];
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
  const text = siteText.infected_per_agroup;

  const hasNoneSelected = ageGroupSelection.length === 0;
  const hasAllSelected = ageGroupSelection.length === 0;

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
    <Legend>
      <List>
        {seriesConfig.map((item) => (
          <Item key={item.label}>
            <ItemButton
              onClick={() => toggleAgeGroup(item.metricProperty)}
              isSelected={!hasAllSelected && item.isSelected}
              color={item.color}
              data-metric-property={item.metricProperty}
              data-text={item.label}
            >
              {item.label}
              <Line color={item.color} />
            </ItemButton>
          </Item>
        ))}
      </List>
      <ResetButton
        onClick={onReset}
        css={css({
          visibility: hasNoneSelected ? 'hidden' : 'visible',
        })}
      >
        {text.reset_button_label}
      </ResetButton>
    </Legend>
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
  isSelected: boolean;
  color: string;
  text?: string;
}>(({ isSelected, color }) =>
  css({
    appearance: 'none',
    background: 'tileGray',
    cursor: 'pointer',
    pr: 10,
    pl: 30,
    py: '3px',
    border: '3px solid',
    borderColor: isSelected ? color : 'transparent',
    fontWeight: isSelected ? 'bold' : 'normal',
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
      outline: '1px dashed black',
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

const ResetButton = styled.button<{ fontWeight?: SystemStyleObject }>(
  ({ fontWeight = 'normal' }) =>
    css({
      backgroundColor: 'blue',
      color: 'white',
      p: 20,
      py: '6px',
      border: 'none',
      fontWeight,
      fontFamily: 'inherit',
      ml: 40,
    })
);

const Line = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: 10,
    backgroundColor: color,
    top: '9px',
    width: '15px',
    height: '3px',
    borderRadius: '2px',
  })
);
