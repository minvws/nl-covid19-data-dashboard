import { Fragment, useRef, useState } from 'react';
import { Box } from './base';
import { css } from '@styled-system/css';
import styled from 'styled-components';

export interface RadioGroupItem {
  label: string;
  value: string;
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
    fontSize: 1,
    textAlign: 'center',
    p: '0.2em 1.5em',
    borderStyle: 'solid',
    borderColor: 'button',
    borderWidth: '1px 0 1px 1px',

    '&:last-child': {
      borderRightWidth: '1px',
    },

    '&:hover, &:focus': {
      bg: '#cae1ed',
    },

    '@media (min-width: 768px)': {
      fontSize: 2,
    },
  })
);

interface RadioGroupProps {
  onChange: (value: any) => void;
  value?: string;
  items: RadioGroupItem[];
}

/**
 * A radiogroup component that takes an array of radiogroup items and
 * reports its changes using the given onSelect callback.
 */
export function RadioGroup(props: RadioGroupProps) {
  const { onChange, items, value } = props;
  const [selectedValue, setSelectedValue] = useState<string>(
    value ?? items[0].value
  );

  const id = useComponentId();

  const onLocalChange = (value: string): void => {
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
            id={`radiogroup-${id}-${index}`}
            type="radio"
            name={`radiogroup-${id}-item-${item.value}`}
            value={item.value}
            checked={selectedValue === item.value}
          />
          <StyledLabel htmlFor={`radiogroup-${id}-${index}`}>
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

export function useComponentId() {
  const idRef = useRef<string>();
  if (idRef.current === undefined) {
    idRef.current = getUniqueId();
  }
  return idRef.current;
}
