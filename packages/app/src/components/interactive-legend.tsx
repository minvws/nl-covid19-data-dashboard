import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';

export interface SelectOption<T = string> {
  metricProperty: T;
  label: string;
  color: string;
  shape?: 'line' | 'circle' | 'square';
}

interface InteractiveLegendProps<T = string> {
  helpText: string;
  selectOptions: SelectOption<T>[];
  selection: T[];
  onToggleItem: (item: T) => void;
  onReset?: () => void;
}

export function InteractiveLegend<T = string>({
  helpText,
  selectOptions,
  selection,
  onToggleItem,
  onReset,
}: InteractiveLegendProps<T>) {
  const { siteText } = useIntl();

  const hasSelection = selection.length !== 0;

  return (
    <Box>
      <Text variant="label1" fontWeight="bold">
        {helpText}
      </Text>
      <Legend>
        <List>
          {selectOptions.map((item) => {
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
                  {item.shape === 'line' && <Line color={item.color} />}
                  {item.shape === 'circle' && <Circle color={item.color} />}
                  {item.shape === 'square' && <Square color={item.color} />}
                </ItemButton>
              </Item>
            );
          })}
          {isDefined(onReset) && (
            <Item>
              <ResetButton onClick={onReset} isVisible={hasSelection}>
                {siteText.common.interactive_legend.reset_button_label}
              </ResetButton>
            </Item>
          )}
        </List>
      </Legend>
    </Box>
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

const Circle = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: asResponsiveArray({ _: '5px', md: 10 }),
    backgroundColor: color,
    top: '6.5px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  })
);

const Square = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: asResponsiveArray({ _: '5px', md: 10 }),
    backgroundColor: color,
    top: '7px',
    width: '11px',
    height: '11px',
    borderRadius: '2px',
  })
);
