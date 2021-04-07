import css from '@styled-system/css';
import styled from 'styled-components';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';

interface SimplifiedSeriesConfig {
  metricProperty: string;
  label: string;
  color: string;
}

interface InteractiveLegendProps {
  helpText: string;
  seriesConfig: SimplifiedSeriesConfig[];
  selection: string[];
  onToggleItem: (item: string) => void;
  onReset: () => void;
}

export function InteractiveLegend({
  helpText,
  seriesConfig,
  selection,
  onToggleItem,
  onReset,
}: InteractiveLegendProps) {
  const { siteText } = useIntl();

  const hasSelection = selection.length !== 0;

  return (
    <>
      <Text fontSize={1} fontWeight="bold" mb={0} mt={2}>
        {helpText}
      </Text>
      <Legend>
        <List>
          {seriesConfig.map((item) => {
            const isSelected = selection.includes(item.metricProperty);
            return (
              <Item key={item.label}>
                <ItemButton
                  onClick={() => onToggleItem(item.metricProperty)}
                  isActive={hasSelection && isSelected}
                  color={item.color}
                  data-text={item.label}
                >
                  {item.label}
                  <Line color={item.color} />
                </ItemButton>
              </Item>
            );
          })}
          <Item>
            <ResetButton onClick={onReset} isVisible={hasSelection}>
              {siteText.common.interactive_legend.reset_button_label}
            </ResetButton>
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

const ResetButton = styled.button<{ isVisible: boolean }>(({ isVisible }) =>
  css({
    backgroundColor: 'transparent',
    cursor: 'pointer',
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

const Line = styled.div<{ color: string }>(({ color }) =>
  css({
    top: '10px',
    width: '15px',
    height: '3px',
    borderRadius: '2px',
    display: 'block',
    position: 'absolute',
    left: asResponsiveArray({ _: '5px', md: 10 }),
    backgroundColor: color,
  })
);
