import css from '@styled-system/css';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import ResetIcon from '~/assets/reset.svg';
import { asResponsiveArray } from '~/style/utils';

interface SelectOption {
  metricProperty: string;
  label: string;
  color: string;
  shape?: 'line' | 'circle';
}

interface SelectedCountriesProps {
  selectOptions: SelectOption[];
  selection: string[];
  onRemoveItem: (metricProperty: string) => void;
}

export function SelectedCountries({
  selectOptions,
  selection,
  onRemoveItem,
}: SelectedCountriesProps) {
  const hasSelection = selection.length !== 0;

  return (
    <>
      {selectOptions.map((item) => {
        const isSelected = selection.includes(item.metricProperty);
        return (
          <Item key={item.label}>
            <ItemButton
              onClick={() => onRemoveItem(item.metricProperty)}
              isActive={hasSelection && isSelected}
              color={item.color}
              data-text={item.label}
              hasRemoveIcon={isDefined(onRemoveItem)}
            >
              {item.label}
              {item.shape === 'line' && <Line color={item.color} />}
              {isDefined(onRemoveItem) && (
                <RemoveIconWrapper>
                  <ResetIcon />
                </RemoveIconWrapper>
              )}
            </ItemButton>
          </Item>
        );
      })}
    </>
  );
}

const RemoveIconWrapper = styled.div(
  css({
    width: '0.6rem',
    position: 'absolute',
    right: 1,
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
  hasRemoveIcon?: boolean;
}>(({ isActive, color, hasRemoveIcon }) =>
  css({
    appearance: 'none',
    backgroundColor: 'tileGray',
    cursor: 'pointer',
    pr: hasRemoveIcon ? 24 : asResponsiveArray({ _: '5px', md: 10 }),
    pl: asResponsiveArray({ _: 25, md: 30 }),
    py: '3px',
    border: '3px solid',
    borderColor: isActive && !hasRemoveIcon ? color : 'transparent',
    fontWeight: 'normal',
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
      content: hasRemoveIcon ? 'attr(data-text)' : undefined,
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
