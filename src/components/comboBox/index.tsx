import { useState, useMemo, useEffect, useRef } from 'react';
import matchSorter from 'match-sorter';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

import useThrottle from 'utils/useThrottle';

type TOption = {
  name: string;
};

type TProps<Option extends TOption> = {
  options: Option[];
  handleSelect: (option: Option) => void;
};

export default ComboBox;

function ComboBox<Option extends TOption>(props: TProps<Option>) {
  const { options, handleSelect } = props;

  const inputRef = useRef<HTMLInputElement>();
  const [term, setTerm] = useState<string>('');
  const results = useSearchedOptions<Option>(term, options);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTerm(event.target.value);
  }

  function onSelect(name: string) {
    const option = options.find((option) => option.name === name);

    handleSelect(option as Option);
  }

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <Combobox openOnFocus onSelect={onSelect}>
      <ComboboxInput
        ref={inputRef}
        onChange={handleChange}
        placeholder="Zoek op gemeente of veiligheidsregio "
      />
      <ComboboxPopover>
        {results.length > 0 ? (
          <ComboboxList>
            {results.slice(0, 10).map((option) => (
              <ComboboxOption key={option.name} value={option.name} />
            ))}
          </ComboboxList>
        ) : (
          <span style={{ display: 'block', margin: 8 }}>No results found</span>
        )}
      </ComboboxPopover>
    </Combobox>
  );
}

function useSearchedOptions<Option extends TOption>(
  term: string,
  options: Option[]
): Option[] {
  const throttledTerm = useThrottle<string>(term, 100);
  const sortByName = (a: Option, b: Option) => a.name.localeCompare(b.name);

  return useMemo(() => {
    if (throttledTerm.trim() === '') return options.sort(sortByName);

    return matchSorter(options, throttledTerm, {
      keys: [(item: Option) => item.name],
    });
  }, [throttledTerm, options]);
}
