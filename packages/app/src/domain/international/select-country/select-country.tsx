import css from '@styled-system/css';
import styled from 'styled-components';

// interface Option<T> {
//   value: T;
//   label: string;
// }

// interface SelectCountryProps<T> {
//   options: Option<T>[];
//   onChange: (value: T) => void;
//   value: string | undefined;
// }

// export function SelectCountry<T>({
//   value,
//   onChange,
//   value,
// }: SelectCountryProps<T>) {
//   return <p>test</p>;
// }

interface Option {
  value: string;
  label: string;
}

interface SelectCountryProps {
  options: Option[];
  onChange: (value: string) => void;
  values: string;
}

export function SelectCountry({
  options,
  onChange,
  values,
}: SelectCountryProps) {
  return (
    <List>
      <input placeholder="Placeholder" />
      {options.map((item, index) => (
        <Button key={index}>{item.label}</Button>
      ))}
      <ListItem />
    </List>
  );
}

const List = styled.ul(css({}));
const ListItem = styled.ul(css({}));
const Button = styled.ul(css({}));
