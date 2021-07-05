import {
  ChangeEvent,
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';
import { assert } from '~/utils/assert';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useHitSelection } from './use-hit-selection';
import { Hit, useSearchResults } from './use-select-country-results';
import { CountryCode } from './country-code';

export interface Country {
  code: CountryCode;
  name: string;
  isSelected?: boolean;
  lastValue?: number;
  searchTerms?: string[];
}

type SearchContext = ReturnType<typeof useSearchContextValue>;

interface SearchContextProviderProps<T extends Element> {
  containerRef: RefObject<T>;
  children: (context: SearchContext) => ReactNode;
  initialValue?: string;
  onSelectCountry: (data: any) => void;
  countries: Country[];
}

const searchContext = createContext<SearchContext | undefined>(undefined);

export function SearchContextProvider<T extends Element>({
  children,
  containerRef,
  initialValue = '',
  onSelectCountry,
  countries,
}: SearchContextProviderProps<T>) {
  const value = useSearchContextValue(
    initialValue,
    containerRef,
    onSelectCountry,
    countries
  );

  return (
    <searchContext.Provider value={value}>
      {children(value)}
    </searchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(searchContext);

  assert(context, 'Missing search context provider');

  return context;
}

function useSearchContextValue<T extends Element>(
  initialValue: string,
  containerRef: RefObject<T>,
  onSelectCountry: (data: any) => void,
  countries: Country[]
) {
  const breakpoints = useBreakpoints();

  const id = '__search';

  /**
   * current search term
   */
  const [term, setTerm] = useState(initialValue);

  /**
   * when a hit is selected (e.g. hitting return-key) the input's value will be
   * replaced with the value of the selected hit.
   */
  const [termSubmitted, setTermSubmitted] = useState('');

  /**
   * Used for showing/hiding search results
   */
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [hasHitFocus, setHasHitFocus] = useState(false);

  /**
   * By default narrow devices will show search-results when the input field
   * has a value. We don't want to show these results when the value is
   * pre-set/pre-populated.
   * To fix this we will listen to an initial focus event on the input element,
   * if that initial event is recognized, we'll allow the results to show.
   */
  const [hasHadInputFocus, setHasHadInputFocus] = useState(false);
  useEffect(() => {
    if (hasInputFocus) setHasHadInputFocus(true);
  }, [hasInputFocus]);

  /**
   * the useSearchResults-hook which will perform the actual search
   */
  const { hits } = useSearchResults(countries, term);

  const showResults =
    hasHadInputFocus && (hasInputFocus || hasHitFocus || !breakpoints.md);

  const { focusRef, focusIndex, setFocusIndex } = useHitSelection({
    numberOfHits: hits.length,
    onSelectHit: (index) => {
      const option = hits[index];
      setTermSubmitted(option.data.name);

      onSelectCountry(option.data);
    },
    /**
     * Only enable keyboard navigation when we show results
     */
    isEnabled: showResults,
  });

  useEffect(() => {
    /**
     * On input-change we'll reset the focus index to 0. It's possible that
     * there is a stronger hit among the VR hits (2nd column). If so, we won't
     * reset the index to 0, instead it will be set to the index of that hit.
     */
    const index = 0;

    setFocusIndex(index);
  }, [setFocusIndex, term]);

  /**
   * An option id is necessary for screen readers to link the search input
   * to the currently selected option.
   */
  const getOptionId = (index: number) => `${id}-result-${index}`;

  useOnClickOutside([containerRef], () => setHasHitFocus(false));

  return {
    hits,
    id,
    setHasHitFocus,
    setTerm,
    showResults,
    term,

    onSelectCountry,

    inputProps: {
      value: termSubmitted || term,
      onChange: (evt: ChangeEvent<HTMLInputElement>) =>
        setTerm(evt.target.value),
      onFocus: () => setHasInputFocus(true),
      /**
       * Usually search-results will disappear when the input loses focus,
       * but this doesn't allow the user to set focus on a search-result using
       * the "tab"-key.
       * The following timeout will handle the blur-event after a small delay.
       * This allows the browser to fire a focusEvent for one of the results,
       * which in turn will keep the search-results alive.
       */
      onBlur: () => setTimeout(() => setHasInputFocus(false), 60),
      'aria-autocomplete': 'list',
      'aria-controls': id,
      'aria-activedescendant': getOptionId(focusIndex),
    },

    comboboxProps: {
      role: 'combobox',
      'aria-expanded': showResults ? 'true' : 'false',
      'aria-haspopup': 'grid',
      'aria-owns': id,
    },

    getOptionProps: (option: Hit<Country>) =>
      ({
        id: getOptionId(option.index),
        ref: option.index === focusIndex ? focusRef : undefined,
        hasFocus: focusIndex === option.index,
        onHover: () => setFocusIndex(option.index),
        onFocus: () => {
          setFocusIndex(option.index);
          setHasHitFocus(true);
        },
      } as const),
  } as const;
}
