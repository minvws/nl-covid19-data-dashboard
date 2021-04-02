import { NlTestedPerAgeGroupValue } from '@corona-dashboard/common';
import css, { SystemStyleObject } from '@styled-system/css';
import styled from 'styled-components';
import { LineSeriesDefinition } from '~/components-styled/time-series-chart/logic';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';

interface AgeGroupLegendProps {
  seriesConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[];
  alwaysEnabledConfig: LineSeriesDefinition<NlTestedPerAgeGroupValue>[];
  ageGroupSelection: string[];
  onToggleAgeGroup: (ageGroupRange: string) => void;
  onReset: () => void;
}

export function AgeGroupLegend({
  seriesConfig,
  alwaysEnabledConfig,
  ageGroupSelection,
  onToggleAgeGroup,
  onReset,
}: AgeGroupLegendProps) {
  const { siteText } = useIntl();
  const text = siteText.infected_per_age_group;

  const hasSelection = ageGroupSelection.length !== 0;

  return (
    <>
      <Text fontSize={1} fontWeight="bold" mb={0} mt={2}>
        {text.legend_help_text}
      </Text>
      <Legend>
        <List>
          {seriesConfig.map((item) => {
            const isSelected = ageGroupSelection.includes(item.metricProperty);
            return (
              <Item key={item.label}>
                <ItemButton
                  onClick={() => onToggleAgeGroup(item.metricProperty)}
                  isActive={hasSelection && isSelected}
                  color={item.color}
                  data-text={item.label}
                >
                  {item.label}
                  <Line color={item.color} lineStyle={item.style ?? 'solid'} />
                </ItemButton>
              </Item>
            );
          })}
          <Item>
            <ResetButton onClick={onReset} isVisible={hasSelection}>
              {text.reset_button_label}
            </ResetButton>
          </Item>
        </List>
      </Legend>
      <Legend>
        <List>
          {alwaysEnabledConfig.map((item) => {
            return (
              <Item key={item.label}>
                <ItemText color={item.color} data-text={item.label}>
                  {item.label}
                  <Line color={item.color} lineStyle={item.style ?? 'solid'} />
                </ItemText>
              </Item>
            );
          })}
          <Item>
            <ItemText data-text={text.line_chart_legend_inaccurate_label}>
              {text.line_chart_legend_inaccurate_label}
              <Square color={colors.data.underReported} />
            </ItemText>
          </Item>
        </List>
      </Legend>
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
    mt: 2,
  })
);

const Item = styled.li(
  css({
    mb: 2,
    mr: asResponsiveArray({ _: 2, md: 3 }),
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
    backgroundColor: 'tileGray',
    cursor: 'pointer',
    pr: asResponsiveArray({ _: '5px', md: 10 }),
    pl: asResponsiveArray({ _: 25, md: 30 }),
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
    fontSize: 1,
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
const ItemText = styled.span(
  css({
    pr: asResponsiveArray({ _: '5px', md: 10 }),
    pl: asResponsiveArray({ _: 20, md: 25 }),
    py: '6px',
    fontSize: 1,
    border: 'none',
    fontWeight: 'normal',
    fontFamily: 'inherit',
    position: 'relative',
  })
);

const ResetButton = styled.button<{ isVisible: boolean }>(({ isVisible }) =>
  css({
    backgroundColor: 'transparent',
    color: 'blue',
    py: '6px',
    border: 'none',
    fontFamily: 'inherit',
    visibility: isVisible ? 'visible' : 'hidden',
    textDecoration: 'underline',
    '&:focus': {
      outline: '2px dotted black',
    },
  })
);

const Line = styled.div<{ color: string; lineStyle: 'dashed' | 'solid' }>(
  ({ color, lineStyle }) =>
    css({
      display: 'block',
      position: 'absolute',
      left: asResponsiveArray({ _: '5px', md: 10 }),
      borderTopColor: color as SystemStyleObject,
      borderTopStyle: lineStyle,
      borderTopWidth: '3px',
      top: '10px',
      width: '15px',
      height: 0,
      borderRadius: '2px',
      [`${ItemText} &`]: {
        left: asResponsiveArray({ _: 0, md: '5px' }),
        top: 13,
      },
    })
);

const Square = styled.div<{ color: string }>(({ color }) =>
  css({
    content: '',
    display: 'block',
    position: 'absolute',
    left: asResponsiveArray({ _: 0, md: '5px' }),
    backgroundColor: color,
    top: '5px',
    width: '15px',
    height: '15px',
  })
);
