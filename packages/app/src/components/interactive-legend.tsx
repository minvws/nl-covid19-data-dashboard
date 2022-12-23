import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { BoldText } from '~/components/typography';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
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

export function InteractiveLegend<T = string>({ helpText, selectOptions, selection, onToggleItem, onReset }: InteractiveLegendProps<T>) {
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
                <StyledLabel htmlFor={`checkboxgroup-${item.label}`} isActive={hasSelection && isSelected} borderColor={item.color} data-text={item.label}>
                  {item.label}
                  {item.shape === 'line' && <Line color={item.color} />}
                  {item.shape === 'circle' && <Circle color={item.color} />}
                  {item.shape === 'square' && <Square color={item.color} />}
                  {item.shape === 'gapped-area' && <GappedArea color={item.color} />}
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
    paddingX: space[0],
    margin: space[0],
    marginTop: space[2],
  })
);

const Item = styled.li(
  css({
    marginBottom: space[2],
    marginRight: space[2],
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
    paddingRight: '13px',
    paddingLeft: '33px',
    paddingY: space[1],
    borderRadius: '5px',
    boxShadow: `inset 0px 0px 0px ${isActive ? `3px ${borderColor}` : `1px ${colors.gray4}`}`,
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
      left: space[0],
      right: space[0],
      top: space[0],
      bottom: space[0],
      borderRadius: '5px',
    },
    '&:after': {
      content: isActive ? 'attr(data-text)' : '',
      position: 'absolute',
      height: '0px',
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
      top: space[0],
      left: space[0],
      bottom: space[0],
      right: space[0],
      width: '100%',
    },
  })
);

const ResetButton = styled.button<{ isVisible: boolean }>(({ isVisible }) =>
  css({
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'blue8',
    paddingY: '6px',
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
    left: '13px',
    backgroundColor: color,
  })
);

const Circle = styled.div<{ color: string }>(({ color }) =>
  css({
    display: 'block',
    position: 'absolute',
    left: '13px',
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
    left: '13px',
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
    left: '13px',
    backgroundColor: `${color}30`,
    borderTop: `2px solid ${color}`,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '11px',
    height: '11px',
    borderRadius: '2px',
  })
);
