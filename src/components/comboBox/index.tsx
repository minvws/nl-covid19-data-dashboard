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

import text from 'locale';
import useMediaQuery from 'utils/useMediaQuery';

type TOption = {
  displayName?: string;
  name: string;
};

type TProps<Option extends TOption> = {
  options: Option[];
  placeholder: string;
  handleSelect: (option: Option) => void;
};

export default ComboBox;

/*
 * Combox is an accessible dropdown with search.
 *
 * @param options - Options to render. Needs to atleast contain a key `name` with a string as value.
 * @param handleSelect - Callback when an option has been selected
 *
 * ComboBox accept a generic type which extends `TOption` ({name: string}).
 *
 * ```ts
 * <Combobox<TSafetyRegion> // generic passed here
 *   handleSelect={handleSafeRegionSelect}
 *   options={safetyRegions}
 * />
 * ```
 */
function ComboBox<Option extends TOption>(props: TProps<Option>) {
  const { options, placeholder, handleSelect } = props;

  const inputRef = useRef<HTMLInputElement>();
  const [term, setTerm] = useState<string>('');
  const results = useSearchedOptions<Option>(term, options);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTerm(event.target.value);
  }

  function onSelect(name: string): void {
    if (!name) {
      return;
    }

    const option = options.find(
      (option) => option.name === name || option.displayName === name
    );

    inputRef?.current?.blur();

    handleSelect(option as Option);
  }

  useEffect(() => {
    if (!inputRef?.current?.value && isLargeScreen) {
      inputRef?.current?.focus();
    }
  }, [isLargeScreen]);

  return (
    <Combobox openOnFocus onSelect={onSelect}>
      <ComboboxInput
        ref={inputRef}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <ComboboxPopover>
        {results.length > 0 ? (
          <ComboboxList>
            {results.map((option) => (
              <ComboboxOption
                key={option.name}
                value={option.displayName || option.name}
              />
            ))}
          </ComboboxList>
        ) : (
          <span>{text.common.zoekveld_geen_resultaten}</span>
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
      keys: [(item: Option) => item.name, 'searchTerms', 'displayName'],
    });
  }, [throttledTerm, options]);
}
