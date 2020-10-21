// @import '~/scss/variables.scss';

// .select-radio-group {
//   background: white;
//   display: flex;

//   input {
//     position: absolute;
//     clip: rect(0, 0, 0, 0);

//     &:checked + label {
//       background: $button-color;
//       color: white;
//     }

//     &:focus + label {
//       outline: 2px dotted #cc005a;
//     }
//   }

// label {
//   flex: 1 1 auto;
//   text-align: center;
//   padding: 0.2em;
//   border: 1px solid $button-color;
//   border-width: 1px 0 1px 1px;
//   color: $button-color;
//   font-size: 14px;

//   &:hover,
//   &:focus {
//     background-color: #cae1ed;
//   }

//   &:last-child {
//     border-right-width: 1px;
//   }

//   @media (min-width: 768px) {
//     font-size: 16px;
//     padding: 0.2em 1.5em;
//   }
// }
// }

import { useMemo, useState } from 'react';
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
      background: 'button',
      color: 'white',
    },
    '&:focus + label': {
      outline: '2px dotted #cc005a',
    },
  })
);

const StyledLabel = styled.label(
  css({
    flex: '1 1 auto',
    textAlign: 'center',
    padding: '0.2em',
    border: '1px solid $button-color',
    borderWidth: '1px 0 1px 1px',
    color: 'button',
    fontSize: '14px',

    '&:hover, &:focus': {
      backgroundColor: '#cae1ed',
    },

    '@media (min-width: 768px)': {
      fontSize: '16px',
      padding: '0.2em 1.5em',
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

  const id = useMemo(() => Math.random().toString(36).substr(2), []);

  const onLocalChange = (value: string): void => {
    if (value !== selectedValue) {
      setSelectedValue(value);
      onChange(value);
    }
  };

  return (
    <Box bg="white" display="flex">
      {items.map((item, index) => (
        <>
          <StyledInput
            key={`radiogroup-${id}-${index}`}
            onChange={() => onLocalChange(item.value)}
            id={`radiogroup-${id}-${index}`}
            type="radio"
            name={`radiogroup-item-${item.value}`}
            value={item.value}
            checked={selectedValue === item.value}
          />
          <StyledLabel htmlFor={`radiogroup-${id}-${index}`}>
            {item.label}
          </StyledLabel>
        </>
      ))}
    </Box>
  );
}
