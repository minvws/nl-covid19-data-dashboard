import css from '@styled-system/css';
import styled from 'styled-components';
import { SelectCountryInput } from './select-country-input';

type Option = {
  value: string;
  label: string;
};

interface SelectCountryProps {
  options: Option[];
  onChange: (value: string) => void;
  values: string;
}

export function SelectCountry({
  options,
  onChange,
  value,
}: SelectCountryProps) {
  return (
    <List>
      <SelectCountryInput value={value} />

      {options.map((item, index) => (
        <Button key={index} onClick={() => onChange(item.value)}>
          {item.label}
        </Button>
      ))}
      <ListItem />
    </List>
  );
}

const List = styled.ul(css({}));
const ListItem = styled.ul(css({}));
const Button = styled.ul(css({}));
