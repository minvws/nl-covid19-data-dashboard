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
import searchUrl from '~/assets/search.svg';
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

  const { commonTexts } = useIntl();

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

    assert(
      option,
      `[${ComboBox.name}:${handleSelect.name}] Failed to find option for name ${name}`
    );

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
            <ComboboxList>
              {results.map((option, index) => (
                <ComboboxOption
                  key={`${index}-${option.name}`}
                  value={option.displayName || option.name}
                />
              ))}
            </ComboboxList>
          ) : (
            <span>{commonTexts.common.zoekveld_geen_resultaten}</span>
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
// Global combobox styles copied from the old SCSS

[data-reach-combobox] {
  position: relative;
  font-size: ${(x) => x.theme.fontSizes[2]};
}

[data-reach-combobox]::after {
  content: '';
  background-image: url('${searchUrl}');
  background-size: 1.5em 1.5em;
  border-radius: 0 0 5px 5px;
  height: 1.5em;
  width: 1.5em;
  display: block;
  position: absolute;
  left: 1.6em;
  top: 2.7em;
  z-index: 100;
}

[data-reach-combobox-popover] {
  border: 1px solid ${(x) => x.theme.colors.icon};
  border-top: none;
  border-radius: 0 0 5px 5px;
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
  border-top: none;
  border-radius: 0 0 5px 5px;
  box-shadow: none;
}

[data-reach-combobox-input] {
  width: 100%;
  padding: 0.75em 1em;
  padding-left: 2.5em;
  font-family: inherit;
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  border: 1px solid ${(x) => x.theme.colors.silver};
  border-radius: 5px;
}

[data-reach-combobox-input]:focus,
[data-reach-combobox-input][data-state="interacting"] {
  border-color: ${(x) => x.theme.colors.icon};
  border-bottom: 1px solid ${(x) => x.theme.colors.silver};
  border-radius: 5px 5px 0 0;
  outline: none;
}

[data-reach-combobox-option] {
  padding: 0.75em 1em;
}

[data-reach-combobox-option]:hover, [data-reach-combobox-option]:focus {
  background: ${(x) => x.theme.colors.offWhite};
}

[data-reach-combobox-option] span {
  font-size: ${(x) => x.theme.fontSizes[2]} ;
  font-weight: normal;
}`;
