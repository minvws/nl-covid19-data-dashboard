import { useRouter } from 'next/router';
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
import { useBreakpoints } from '~/utils/useBreakpoints';
import { useHitSelection } from './use-hit-selection';
import { Hit, Option, useSearchResults } from './use-search-results';

type SearchContext = ReturnType<typeof useSearchContextValue>;

interface SearchContextProviderProps<T extends Element> {
  containerRef: RefObject<T>;
  children: (context: SearchContext) => ReactNode;
}

const searchContext = createContext<SearchContext | undefined>(undefined);

export function SearchContextProvider<T extends Element>({
  children,
  containerRef,
}: SearchContextProviderProps<T>) {
  const value = useSearchContextValue(containerRef);

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

function useSearchContextValue<T extends Element>(containerRef: RefObject<T>) {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const id = '__search';

  /**
   * current search term
   */
  const [term, setTerm] = useState('');

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
   * the useSearchResults-hook which will perform the actual search
   */
  const { hits, vrHits, gmHits } = useSearchResults(term);

  const { focusRef, focusIndex, setFocusIndex } = useHitSelection({
    numberOfHits: hits.length,
    onSelectHit: (index, openInNewWindow) => {
      const option = hits[index];
      setTermSubmitted(option.data.name);

      return openInNewWindow
        ? window.open(option.data.link, '_blank')
        : router.push(option.data.link);
    },
  });

  useEffect(() => {
    /**
     * On input-change we'll reset the focus index to 0. It's possible that
     * there is a stronger hit among the VR hits (2nd column). If so, we won't
     * reset the index to 0, instead it will be set to the index of that hit.
     */
    const index = vrHits[0]?.score === 1 ? vrHits[0].index : 0;

    setFocusIndex(index);
  }, [setFocusIndex, term, vrHits]);

  /**
   * An option id is necessary for screen readers to link the search input
   * to the currently selected option.
   */
  const getOptionId = (index: number) => `${id}-result-${index}`;

  const showResults =
    !!term && (hasInputFocus || hasHitFocus || !breakpoints.md);

  useOnClickOutside([containerRef], () => setHasHitFocus(false));

  return {
    gmHits,
    hits,
    id,
    setHasHitFocus,
    setTerm,
    showResults,
    term,
    vrHits,

    inputProps: {
      value: termSubmitted || term,
      onChange: (evt: ChangeEvent<HTMLInputElement>) =>
        setTerm(evt.target.value),
      onFocus: () => setHasInputFocus(true),
      onBlur: () => setHasInputFocus(false),
      'aria-autocomplete': 'list',
      'aria-controls': id,
      'aria-activedescendant': getOptionId(focusIndex),
      disabled: !!termSubmitted,
    },

    comboboxProps: {
      role: 'combobox',
      'aria-expanded': showResults ? 'true' : 'false',
      'aria-haspopup': 'grid',
      'aria-owns': id,
    },

    getOptionProps: (option: Hit<Option>) =>
      ({
        id: getOptionId(option.index),
        ref: option.index === focusIndex ? focusRef : undefined,
        href: option.data.link,
        hasFocus: focusIndex === option.index,
        onHover: () => setFocusIndex(option.index),
        onFocus: () => {
          setFocusIndex(option.index);
          setHasHitFocus(true);
        },
      } as const),
  } as const;
}
