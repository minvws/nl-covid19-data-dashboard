import { css } from '@styled-system/css';
import { Fragment } from 'react';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { useUniqueId } from '~/utils/use-unique-id';
import { Box } from './base';
import { InlineText } from './typography';

export interface RadioGroupItem<T extends string> {
  label: string;
  value: T;
  ariaLabel?: string;
}

const StyledInput = styled.input(
  css({
    position: 'absolute',
    clip: 'rect(0, 0, 0, 0)',
    '&:checked + label': {
      bg: 'button',
      color: 'white',
      borderColor: 'blue',
    },
    '&:focus-visible + label': {
      outline: '2px dotted #cc005a',
    },
  })
);

const StyledLabel = styled.label(
  css({
    flex: '0 1 auto',
    color: 'button',
    textAlign: 'center',
    p: asResponsiveArray({ _: '0.25rem 0.5rem', xs: '0.3rem 1rem' }),
    borderRadius: '5px 0 0 5px',
    border: '1px solid silver',
    borderRightWidth: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    height: '36px',
    transition: '0.1s background-color',

    '&:last-child': {
      borderWidth: '1px 1px 1px 0',
      borderRadius: '0 5px 5px 0',
    },

    '&:hover, &:focus': {
      bg: 'tileGray',
      color: 'blue',
      borderColor: 'blue'
    },
  })
);

interface RadioGroupProps<T extends string> {
  onChange: (value: T) => void;
  value: T;
  items: RadioGroupItem<T>[];
}

/**
 * A radiogroup component that takes an array of radiogroup items and
 * reports its changes using the given onSelect callback.
 */
export function RadioGroup<T extends string>(props: RadioGroupProps<T>) {
  const { onChange, items, value } = props;
  const id = useUniqueId();

  return (
    <Box bg="white" display="flex" justifyContent="center" data-cy="radiogroup">
      {items.map((item, index) => (
        <Fragment key={`radiogroup-${id}-input-${index}`}>
          <StyledInput
            onChange={() => onChange(item.value)}
            id={`radiogroup-${item.value}-${id}-${index}`}
            type="radio"
            name={`radiogroup-${id}-item-${item.value}`}
            value={item.value}
            checked={value === item.value}
            aria-label={value === item.value ? item.ariaLabel : undefined}
          />
          <StyledLabel htmlFor={`radiogroup-${item.value}-${id}-${index}`}>
            <InlineText variant="button2">{item.label}</InlineText>
          </StyledLabel>
        </Fragment>
      ))}
    </Box>
  );
}
