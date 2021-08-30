import {
  KeyboardEventHandler,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isPresent } from 'ts-is-present';
import { useUniqueId } from '~/utils/use-unique-id';
import { Option } from '../types';

enum Actions {
  Close,
  CloseSelect,
  First,
  Last,
  Next,
  Open,
  PageDown,
  PageUp,
  Previous,
  Select,
  Type,
}

export function useRichContentSelect<T extends string>(
  options: Option<T>[],
  onChange: (option: Option<T>) => void,
  initialValue?: T
) {
  const comboboxRef = useRef<HTMLDivElement>(null);
  const listBoxRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [ignoreBlur, setIgnoreBlur] = useState(false);

  const [activeIndex, setActiveIndex] = useState(() => {
    // set the initial activeIndex
    if (initialValue) {
      return options.findIndex((el) => el.value === initialValue);
    }

    return 0;
  });

  // make sure activeIndex and selectedOption are in sync at component mount
  const [selectedOption, setSelectedOption] = useState(
    () => options[activeIndex]
  );

  const searchString = useRef('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const labelId = useUniqueId();
  const listBoxId = useUniqueId();

  const filterOptions = useCallback(
    (options: Option<T>[], filter: string, exclude: T[] = []) => {
      return options.filter((option) => {
        const matches =
          option.value.toLowerCase().indexOf(filter.toLowerCase()) === 0;
        return matches && exclude.indexOf(option.value) < 0;
      });
    },
    []
  );

  const getActionFromKey = useCallback(
    (event) => {
      const { key, altKey, ctrlKey, metaKey } = event;

      const noModifiers = !altKey && !ctrlKey && !metaKey;

      // Keys that should trigger an open action
      const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

      // handle opening when closed
      if (!expanded && openKeys.includes(key)) {
        return Actions.Open;
      }

      // Home and End move the selected option when open or closed
      if (key === 'Home') return Actions.First;
      if (key === 'End') return Actions.Last;

      // handle typing characters when open or closed
      if (
        key === 'Backspace' ||
        key === 'Clear' ||
        (key.length === 1 && key !== ' ' && noModifiers)
      ) {
        return Actions.Type;
      }

      // handle keys when open
      if (expanded) {
        if (key === 'ArrowUp' && altKey) {
          return Actions.CloseSelect;
        } else if (key === 'ArrowDown' && !altKey) {
          return Actions.Next;
        } else if (key === 'ArrowUp') {
          return Actions.Previous;
        } else if (key === 'PageUp') {
          return Actions.PageUp;
        } else if (key === 'PageDown') {
          return Actions.PageDown;
        } else if (key === 'Escape') {
          return Actions.Close;
        } else if (key === 'Enter' || key === ' ') {
          return Actions.CloseSelect;
        }
      }
    },
    [expanded]
  );

  // return the index of an option from an array of options, based on a search string
  // if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
  const getIndexByLetter = useCallback(
    (options: Option<T>[], filter: string, startIndex = 0) => {
      const orderedOptions = [
        ...options.slice(startIndex),
        ...options.slice(0, startIndex),
      ];

      const firstMatch = filterOptions(orderedOptions, filter)[0];

      const allSameLetter = (arr: string[]) =>
        arr.every((letter) => letter === arr[0]);

      if (firstMatch) {
        return options.indexOf(firstMatch);
      }
      // if the same letter is being repeated, cycle through first-letter matches
      else if (allSameLetter(filter.split(''))) {
        const matches = filterOptions(orderedOptions, filter[0]);
        return options.indexOf(matches[0]);
      }

      // if no matches, return -1
      else {
        return -1;
      }
    },
    [filterOptions]
  );

  // get an updated option index after performing an action
  const getUpdatedIndex = useCallback(
    (currentIndex: number, maxIndex: number, action: Actions) => {
      const pageSize = 10; // used for pageup/down

      switch (action) {
        case Actions.First:
          return 0;
        case Actions.Last:
          return maxIndex;
        case Actions.Previous:
          return Math.max(0, currentIndex - 1);
        case Actions.Next:
          return Math.min(maxIndex, currentIndex + 1);
        case Actions.PageUp:
          return Math.max(0, currentIndex - pageSize);
        case Actions.PageDown:
          return Math.min(maxIndex, currentIndex + pageSize);
        default:
          return currentIndex;
      }
    },
    []
  );

  const updateExpandedState = useCallback(
    (nextExpanded, callFocus = true) => {
      if (expanded === nextExpanded) return;
      setExpanded(nextExpanded);
      if (callFocus) comboboxRef.current?.focus();
    },
    [expanded]
  );

  const isScrollable = useCallback((el: HTMLElement | null) => {
    if (isPresent(el)) {
      return el.clientHeight < el.scrollHeight;
    }

    return false;
  }, []);

  const maintainScrollVisibility = useCallback(
    (activeElement: HTMLElement | null, scrollParent: HTMLElement | null) => {
      if (isPresent(scrollParent) && isPresent(activeElement)) {
        const { offsetHeight, offsetTop } = activeElement;
        const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

        const isAbove = offsetTop < scrollTop;
        const isBelow =
          offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

        if (isAbove) {
          scrollParent.scrollTo(0, offsetTop);
        } else if (isBelow) {
          scrollParent.scrollTo(
            0,
            offsetTop + offsetHeight - parentOffsetHeight
          );
        }
      }
    },
    []
  );

  const selectOption = useCallback(
    (index: number) => {
      setActiveIndex(index);
      setSelectedOption(options[index]);
      onChange(options[index]);
    },
    [options, onChange]
  );

  const findSearchStringMatch = useCallback(() => {
    const searchIndex = getIndexByLetter(
      options,
      searchString.current,
      activeIndex + 1
    );

    // if a match was found, go to it
    if (searchIndex >= 0) {
      setActiveIndex(searchIndex);
    } else if (typeof searchTimeout === 'number') {
      // if no matches, clear the timeout and search string
      window.clearTimeout(searchTimeout);
      setSearchTimeout(null);
      searchString.current = '';
    }
  }, [activeIndex, getIndexByLetter, options, searchTimeout]);

  const updateSearchString = useCallback(
    (char: string) => {
      if (typeof searchTimeout === 'number') {
        clearTimeout(searchTimeout);
        setSearchTimeout(null);
      }

      const timeoutId = setTimeout(() => {
        searchString.current = '';
      }, 500);

      setSearchTimeout(timeoutId);
      searchString.current = searchString.current + char;
      findSearchStringMatch();
    },
    [findSearchStringMatch, searchTimeout]
  );

  const onComboType = useCallback(
    (char: string) => {
      // open the listbox if it was closed
      updateExpandedState(true);
      // get the index of the first option that starts with the letter
      updateSearchString(char);
    },
    [updateExpandedState, updateSearchString]
  );

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (evt) => {
      const { key } = evt;
      const max = options.length - 1;
      const action = getActionFromKey(evt);

      switch (action) {
        case Actions.Last:
        case Actions.First:
          updateExpandedState(true);
        // intentional fallthrough
        case Actions.Next:
        case Actions.Previous:
        case Actions.PageUp:
        case Actions.PageDown:
          evt.preventDefault();
          return setActiveIndex(getUpdatedIndex(activeIndex, max, action));
        case Actions.CloseSelect:
          evt.preventDefault();
          selectOption(activeIndex);
        // intentional fallthrough
        case Actions.Close:
          evt.preventDefault();
          return updateExpandedState(false);
        case Actions.Type:
          return onComboType(key);
        case Actions.Open:
          evt.preventDefault();
          return updateExpandedState(true);
      }
    },
    [
      activeIndex,
      getActionFromKey,
      getUpdatedIndex,
      onComboType,
      options.length,
      selectOption,
      updateExpandedState,
    ]
  );

  // if the activeIndex changes, make sure the selected element is in view
  useEffect(() => {
    if (
      isPresent(listBoxRef.current) &&
      isPresent(listBoxRef.current.childNodes)
    ) {
      const el = Array.from(listBoxRef.current.childNodes)[activeIndex];
      if (isPresent(el) && isScrollable(listBoxRef.current)) {
        maintainScrollVisibility(el as HTMLElement, listBoxRef.current);
      }
    }
  }, [activeIndex, isScrollable, maintainScrollVisibility]);

  return useMemo(
    () => ({
      labelId,
      selectedOption,
      getComboboxProps() {
        return {
          ref: comboboxRef,
          role: 'combobox',
          'aria-controls': listBoxId,
          'aria-expanded': expanded,
          'aria-haspopup': 'listbox' as const,
          'aria-labelledby': labelId,
          'aria-activedescendant': `${listBoxId}-${activeIndex}`,
          tabIndex: 0,
          onBlur: () => {
            if (ignoreBlur) {
              setIgnoreBlur(false);
              return;
            }

            if (expanded) {
              selectOption(activeIndex);
              updateExpandedState(false, false);
            }
          },
          onClick: () => updateExpandedState(!expanded, false),
          onKeyDown: handleKeyDown,
        };
      },
      getListBoxProps() {
        return {
          ref: listBoxRef,
          id: listBoxId,
          role: 'listbox',
          'aria-labelledby': labelId,
          tabIndex: -1,
        };
      },
      getListBoxOptionsProps(index: number) {
        return {
          role: 'option',
          id: `${listBoxId}-${index}`,
          'aria-selected': activeIndex === index,
          onClick: (evt: MouseEvent) => {
            evt.stopPropagation();
            selectOption(index);
            updateExpandedState(false);
          },
          onMouseDown: () => {
            setIgnoreBlur(true);
          },
        };
      },
    }),
    [
      activeIndex,
      expanded,
      handleKeyDown,
      ignoreBlur,
      labelId,
      listBoxId,
      selectOption,
      selectedOption,
      updateExpandedState,
    ]
  );
}
