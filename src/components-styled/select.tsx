import css from '@styled-system/css';
import styled from 'styled-components';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  options: Option<T>[];
  value: string | undefined;
  onChange: (value: T) => void;
  placeholder?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: SelectProps<T>) {
  return (
    <StyledSelect
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {placeholder && (
        <option value="" disabled selected={value === undefined}>
          {placeholder}
        </option>
      )}

      {options.map(({ value, label }) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled.select(
  css({
    display: 'inline-block',
    minWidth: '15em',
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'lightGray',
    fontFamily: 'body',
    fontSize: 2,
    appearance: 'none',
    p: 2,
    pr: 4,
    background: `url('/images/chevron-down.svg')`,
    backgroundSize: '14px 14px',
    backgroundRepeat: 'no-repeat, repeat',
    backgroundPosition: 'right 0.5em top 60%, 0 0',
    '&:focus': {
      borderColor: 'lightGray',
      outline: '2px dotted',
      outlineColor: 'blue',
    },
    '&::-ms-expand': {
      display: 'none',
    },
  })
);
