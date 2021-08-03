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
}

const StyledInput = styled.input(
  css({
    position: 'absolute',
    clip: 'rect(0, 0, 0, 0)',
    '&:checked + label': {
      bg: 'button',
      color: 'white',
    },
    '&:focus + label': {
      outline: '2px dotted #cc005a',
    },
  })
);

const StyledLabel = styled.label(
  css({
    flex: '0 1 auto',
    color: 'button',
    textAlign: 'center',
    p: asResponsiveArray({ _: '0.25em 0.5em', xs: '0.2em 1.5em' }),
    borderStyle: 'solid',
    borderColor: 'button',
    borderWidth: '1px 0 1px 1px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',

    '&:last-child': {
      borderRightWidth: '1px',
    },

    '&:hover, &:focus': {
      bg: '#cae1ed',
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
          />
          <StyledLabel htmlFor={`radiogroup-${item.value}-${id}-${index}`}>
            <InlineText variant="button3">{item.label}</InlineText>
          </StyledLabel>
        </Fragment>
      ))}
    </Box>
  );
}
