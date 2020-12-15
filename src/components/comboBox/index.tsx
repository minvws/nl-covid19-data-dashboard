import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import css from '@styled-system/css';
import matchSorter from 'match-sorter';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '~/components-styled/base';
import text from '~/locale/index';
import { assert } from '~/utils/assert';
import { useMediaQuery } from '~/utils/useMediaQuery';
import { useThrottle } from '~/utils/useThrottle';

type TOption = {
  displayName?: string;
  name: string;
};

type TProps<Option extends TOption> = {
  options: Option[];
  placeholder: string;
  onSelect: (option: Option) => void;
};

/**
 * Combobox is an accessible dropdown with search.
 *
 * @param options - Options to render. Needs to at least contain a key `name` with a string as value.
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
export function ComboBox<Option extends TOption>(props: TProps<Option>) {
  const { options, placeholder } = props;

  const router = useRouter();
  const { code } = router.query;
  const inputRef = useRef<HTMLInputElement>();
  const [inputValue, setInputValue] = useState<string>('');
  const results = useSearchedOptions<Option>(inputValue, options);
  const isLargeScreen = useMediaQuery('(min-width: 1000px)');
  const hasRegionSelected = !!code;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.target.value);
  }

  function handleSelect(name: string): void {
    if (!name) {
      return;
    }

    const option = options.find(
      (option) => option.name === name || option.displayName === name
    );

    assert(option, `Failed to find option for name ${name}`);

    props.onSelect(option);

    /**
     * If blur gets called immediately it does not work for some reason.
     */
    setTimeout(() => {
      inputRef.current?.blur();
    }, 1);
  }

  useEffect(() => {
    if (!inputRef.current?.value && isLargeScreen && !hasRegionSelected) {
      inputRef.current?.focus();
    }
  }, [isLargeScreen, hasRegionSelected]);

  return (
    <Box role="search" css={css({ '[data-reach-combobox]': { px: 3, py: 4 } })}>
      <Combobox openOnFocus onSelect={handleSelect}>
        <ComboboxInput
          ref={inputRef}
          onChange={handleInputChange}
          placeholder={placeholder}
        />
        <ComboboxPopover>
          {results.length > 0 ? (
            <ComboboxList persistSelection>
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
    </Box>
  );
}

function useSearchedOptions<Option extends TOption>(
  term: string,
  options: Option[]
): Option[] {
  const throttledTerm = useThrottle(term, 100);
  const sortByName = (a: Option, b: Option) => a.name.localeCompare(b.name);

  return useMemo(() => {
    if (throttledTerm.trim() === '') return options.sort(sortByName);

    return matchSorter(options, throttledTerm.trim(), {
      keys: [(item: Option) => item.name, 'searchTerms', 'displayName'],
    });
  }, [throttledTerm, options]);
}
