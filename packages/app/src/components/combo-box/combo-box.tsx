import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from '@reach/combobox';
import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Box } from '~/components/base';
import { useIntl } from '~/intl';
import { assert } from '~/utils/assert';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useThrottle } from '~/utils/use-throttle';

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
 * <Combobox<TVr> // generic passed here
 *   handleSelect={handleSafeRegionSelect}
 *   options={vr_collection
 * />
 * ```
 */
export function ComboBox<Option extends TOption>(props: TProps<Option>) {
  const { options, placeholder } = props;

  const { siteText } = useIntl();

  const router = useRouter();
  const { code } = router.query;
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const results = useSearchedOptions<Option>(inputValue, options);
  const breakpoints = useBreakpoints();
  const isLargeScreen = breakpoints.md;
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
            <span>{siteText.common.zoekveld_geen_resultaten}</span>
          )}
        </ComboboxPopover>
      </Combobox>
      <ComboBoxStyles />
    </Box>
  );
}

function useSearchedOptions<Option extends TOption>(
  term: string,
  options: Option[]
): Option[] {
  const throttledTerm = useThrottle(term, 100);

  return useMemo(
    () =>
      throttledTerm.trim() === ''
        ? options.sort((a: Option, b: Option) => a.name.localeCompare(b.name))
        : matchSorter(options, throttledTerm.trim(), {
            keys: [(item: Option) => item.name, 'searchTerms', 'displayName'],
          }),
    [throttledTerm, options]
  );
}

const ComboBoxStyles = createGlobalStyle`
// Global comobox styles copied from the old SCSS

[data-reach-combobox] {
  position: relative;
  font-size: ${(x) => x.theme.fontSizes[2]};
}

[data-reach-combobox]::after {
  content: '';
  background-image: url('/images/search.svg');
  background-size: 1.5em 1.5em;
  height: 1.5em;
  width: 1.5em;
  display: block;
  position: absolute;
  left: 1.6em;
  top: 2.7em;
  z-index: 100;
}

[data-reach-combobox-popover] {
  z-index: 100;
}

[data-reach-combobox-popover] > span {
  display: block;
  padding: 0.75em 1em;
  font-size: ${(x) => x.theme.fontSizes[2]} ;
}

[data-reach-combobox-list] {
  height: 30em;
  overflow-y: scroll;
  border: none;
  box-shadow: 0 -1px 1px 0 #e5e5e5, 0 1px 1px 0 #e5e5e5, 0 2px 2px 0 #e5e5e5,
  0 4px 4px 0 #e5e5e5, 0 6px 6px 0 #e5e5e5;
}

[data-reach-combobox-input] {
  width: 100%;
  padding: 0.75em 1em;
  padding-left: 2.5em;
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  border: 1px solid #c4c4c4;
}

[data-reach-combobox-input]:focus {
  border-color: ${(x) => x.theme.colors.icon};
  outline: none;
}

[data-reach-combobox-option] {
  padding: 0.75em 1em;
}

[data-reach-combobox-option]:hover, [data-reach-combobox-option]:focus {
  background: ${(x) => x.theme.colors.page};
}

[data-reach-combobox-option] span {
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  font-weight: normal;
}`;
