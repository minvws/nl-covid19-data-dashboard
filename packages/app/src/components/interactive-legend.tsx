import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { Box } from './base';

export interface SelectOption<T = string> {
  metricProperty: T;
  label: string;
  color: string;
  shape?: 'line' | 'circle' | 'square' | 'gapped-area';
  legendAriaLabel?: string;
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
  const { commonTexts } = useIntl();

  const hasSelection = selection.length !== 0;

  return (
    <Box>
      <BoldText variant="label1">{helpText}</BoldText>
      <Legend>
        <List>
          {selectOptions.map((item) => {
            const isSelected = selection.includes(item.metricProperty);
            return (
              <Item key={item.label}>
                <StyledLabel
                  htmlFor={`checkboxgroup-${item.label}`}
                  isActive={hasSelection && isSelected}
                  borderColor={item.color}
                  data-text={item.label}
                >
                  {item.label}
                  {item.shape === 'line' && <Line color={item.color} />}
                  {item.shape === 'circle' && <Circle color={item.color} />}
                  {item.shape === 'square' && <Square color={item.color} />}
                  {item.shape === 'gapped-area' && (
                    <GappedArea color={item.color} />
                  )}
                </StyledLabel>
                <StyledInput
                  type="checkbox"
                  id={`checkboxgroup-${item.label}`}
                  value={item.label}
                  onClick={() => onToggleItem(item.metricProperty)}
                  aria-label={item.legendAriaLabel}
                />
              </Item>
            );
          })}
          {isDefined(onReset) && (
            <Item>
              <ResetButton onClick={onReset} isVisible={hasSelection}>
                {commonTexts.common.interactive_legend.reset_button_label}
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
    mr: 2,
    position: 'relative',
    display: 'inline-block',
  })
);

/**
 * Styling for this button contains:
 * :before to render the colored line on hover/focus
 * :after to widen the button to avoid font-weight bold jumps
 */

const StyledLabel = styled.label<{
  isActive: boolean;
  borderColor: string;
  text?: string;
}>(({ isActive, borderColor }) =>
  css({
    height: '29px',
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-flex',
    pr: 13,
    pl: 33,
    py: 1,
    borderRadius: '5px',
    boxShadow: `inset 0px 0px 0px ${
      isActive ? `3px ${borderColor}` : `1px ${colors.gray4}`
    }`,
    fontWeight: 'normal',
    fontFamily: 'inherit',
    fontSize: 1,
    color: isActive ? 'transparent' : 'black',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover,&:focus': {
      bg: 'gray1',
      borderColor: borderColor,
      borderWidth: isActive ? '3px' : '1px',
      boxShadow: `inset 0px 0px 0px ${isActive ? '3px' : '2px'} ${borderColor}`,
    },
    '&:focus': {
      borderColor: 'gray3',
      borderWidth: '1px',
    },
    '&:focus:focus-visible': {
      outline: '2px dotted currentColor',
    },
    '&:before': {
      bg: isActive ? borderColor : 'white',
      opacity: '.1',
      content: 'attr(data-color)',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderRadius: '5px',
    },
    '&:after': {
      content: isActive ? 'attr(data-text)' : '',
      position: 'absolute',
      height: 0,
      userSelect: 'none',
      pointerEvents: 'none',
      fontWeight: 'bold',
      color: 'black',
    },
  })
);

const StyledInput = styled.input(
  css({
    appearance: 'none',
    '&:focus:focus-visible': {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
    },
  })
);

const ResetButton = styled.button<{ isVisible: boolean }>(({ isVisible }) =>
  css({
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'blue8',
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
    top: '50%',
    transform: 'translateY(-50%)',
    width: '15px',
    height: '3px',
    borderRadius: '2px',
    display: 'block',
    position: 'absolute',
    left: 13,
    backgroundColor: color,
  })
);

const Circle = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: 13,
    backgroundColor: color,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  })
);

const Square = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: 13,
    backgroundColor: color,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '11px',
    height: '11px',
    borderRadius: '2px',
  })
);

const GappedArea = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: 13,
    backgroundColor: `${color}30`,
    borderTop: `2px solid ${color}`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '11px',
    height: '11px',
    borderRadius: '2px',
  })
);
