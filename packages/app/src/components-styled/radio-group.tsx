import { Fragment, useRef, useState } from 'react';
import { Box } from './base';
import { css } from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
interface RadioGroupItem<T extends string> {
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
    fontSize: asResponsiveArray({ _: 1, sm: 2 }),
    textAlign: 'center',
    p: asResponsiveArray({ _: '0.25em 0.5em', xs: '0.2em 1.5em' }),
    borderStyle: 'solid',
    borderColor: 'button',
    borderWidth: '1px 0 1px 1px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',

    '&:last-child': {
      borderRightWidth: '1px',
    },

    '&:hover, &:focus': {
      bg: '#cae1ed',
    },
  })
);

interface RadioGroupProps<T extends string> {
  onChange: (value: any) => void;
  value?: T;
  items: RadioGroupItem<T>[];
}

/**
 * A radiogroup component that takes an array of radiogroup items and
 * reports its changes using the given onSelect callback.
 */
export function RadioGroup<T extends string>(props: RadioGroupProps<T>) {
  const { onChange, items, value } = props;
  const [selectedValue, setSelectedValue] = useState<T>(
    value ?? items[0].value
  );

  const id = useComponentId();

  const onLocalChange = (value: T): void => {
    if (value !== selectedValue) {
      setSelectedValue(value);
      onChange(value);
    }
  };

  return (
    <Box bg="white" display="flex" justifyContent="center">
      {items.map((item, index) => (
        <Fragment key={`radiogroup-${id}-input-${index}`}>
          <StyledInput
            onChange={() => onLocalChange(item.value)}
            id={`radiogroup-${item.value}-${id}-${index}`}
            type="radio"
            name={`radiogroup-${id}-item-${item.value}`}
            value={item.value}
            checked={selectedValue === item.value}
          />
          <StyledLabel htmlFor={`radiogroup-${item.value}-${id}-${index}`}>
            {item.label}
          </StyledLabel>
        </Fragment>
      ))}
    </Box>
  );
}

/**
 * Generic hook for using a unique component id
 * See https://gist.github.com/sqren/fc897c1629979e669714893df966b1b7#gistcomment-3189166
 *
 * Currently only used here, so it's kept local, but if we start using it
 * elsewhere it should be moved of course.
 */
let uniqueId = 0;
const getUniqueId = () => String(uniqueId++);

// This was the previous uid generator
// const getUniqueId = () => Math.random().toString(36).substr(2);

function useComponentId() {
  const idRef = useRef<string>();
  if (idRef.current === undefined) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
