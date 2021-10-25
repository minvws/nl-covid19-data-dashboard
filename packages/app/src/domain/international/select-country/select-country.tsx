import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useUniqueId } from '~/utils/use-unique-id';
import { SelectCountryInput } from './select-country-input';
import { useHitSelection } from './use-hit-selection';

export type Option = {
  value: string;
  label: string;
};

interface SelectCountryProps {
  options: Option[];
  onChange: (value: string) => void;
  value: string;
}

export function SelectCountry({
  options,
  onChange,
  value,
}: SelectCountryProps) {
  const { siteText } = useIntl();
  const uniqueId = useUniqueId();

  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(value);
  const [matchingCountries, setMatchingCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Tracking when the mouse
   */
  const [isMouseDown, setIsMouseDown] = useState(false);

  /**
   * The currently selected item, we need to save this so we can always fall back to this country.
   */
  const currentOption = options.filter((item) => item.value === value)[0];

  /**
   * Find all the results that match the label as well as the value
   */
  useEffect(() => {
    setMatchingCountries(
      matchSorter(options, inputValue, {
        keys: ['label', 'value'],
      }).map((item: Option) => item.value) as []
    );
  }, [options, inputValue]);

  const handleOnFocus = () => {
    setIsOpen(true);
    setInputValue('');
  };

  const handleOnClose = () => {
    setIsOpen(false);
    setInputValue(currentOption.label);
  };

  const { focusIndex, focusRef, setFocusIndex } = useHitSelection({
    isEnabled: isOpen,
    onSelectHit: (index) => {
      setIsOpen(false);
      onChange(matchingCountries[index]);
      // When the user presses "enter" we toggle off the focus state for the element.
      if (inputRef.current) inputRef.current.blur();
    },
    maxPossibleItems: matchingCountries.length,
    handleOnClose,
  });

  const handleOnClick = (item: Option) => {
    setIsOpen(false);
    onChange(item.value);
  };

  useOnClickOutside([containerRef], () => handleOnClose());

  const handleOnMouseEnter = (index: number) => {
    setFocusIndex(index);
  };

  /**
   * Every time the user inputs a new value reset the focus index to the beginning of the results.
   */
  useEffect(() => {
    if (inputValue.length > 0 && isOpen) {
      setFocusIndex(0);
    }
  }, [inputValue, setFocusIndex, isOpen]);

  const prefixId = `select_country_${uniqueId}`;

  return (
    <Box position="relative" ref={containerRef}>
      <SelectCountryInput
        prefixId={prefixId}
        currentOption={currentOption}
        isOpen={isOpen}
        inputValue={inputValue}
        inputRef={inputRef}
        setInputValue={setInputValue}
        handleOnClose={handleOnClose}
        handleOnFocus={handleOnFocus}
        isMouseDown={isMouseDown}
      />

      <OrderedList
        id={`${prefixId}_list`}
        tabIndex={-1}
        role="listbox"
        aria-labelledby={prefixId}
        isOpen={isOpen}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        /**
         * If the dropdown is open set the aria-activedescendant to the highlighted country.
         * When closed reset it to the current selected country.
         */
        aria-activedescendant={
          isOpen
            ? `${prefixId}_${matchingCountries[focusIndex]}`
            : `${prefixId}_${currentOption.value}`
        }
      >
        {matchingCountries.length > 0 ? (
          <>
            {options
              .filter((item) => matchingCountries.includes(item.value))
              .map((item, index) => {
                const hasFocus = index === focusIndex;

                return (
                  <ListItem
                    key={index}
                    role="option"
                    id={`${prefixId}_${item.value}`}
                    aria-selected={hasFocus}
                    ref={hasFocus ? focusRef : null}
                    hasFocus={hasFocus}
                    onClick={() => handleOnClick(item)}
                    onMouseDown={() => handleOnClick(item)}
                    onMouseEnter={() => handleOnMouseEnter(index)}
                  >
                    <img
                      aria-hidden
                      src={`/icons/flags/${item.value.toLowerCase()}.svg`}
                      width="17"
                      height="13"
                      alt=""
                      css={css({
                        mr: 2,
                      })}
                    />
                    <InlineText
                      fontWeight={value === item.value ? 'bold' : undefined}
                    >
                      {item.label}
                    </InlineText>
                  </ListItem>
                );
              })}
          </>
        ) : (
          <StyledNoHits>
            <Text variant="label1">
              {siteText.select_countries.no_countries_found}
            </Text>
            <Text variant="label1">
              {siteText.select_countries.no_countries_found_hint}
            </Text>
          </StyledNoHits>
        )}
      </OrderedList>
    </Box>
  );
}

const OrderedList = styled.ol<{ isOpen: boolean }>((x) =>
  css({
    display: x.isOpen ? 'block' : 'none',
    position: 'absolute',
    top: '100%',

    width: '100%',

    border: `1px solid`,
    borderColor: 'silver',
    borderTopColor: 'transparent',
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,

    backgroundColor: 'white',
    zIndex: 10,
    m: 0,
    p: 0,
    maxHeight: '20em',
    overflow: 'auto',
  })
);

const ListItem = styled.li<{ hasFocus?: boolean }>((x) =>
  css({
    px: 3,
    py: 2,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'body',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'white',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
    border: 'none',
    textAlign: 'left',

    '&:hover': {
      cursor: 'pointer',
    },
  })
);

const StyledNoHits = styled.div(
  css({
    color: 'gray',
    textAlign: 'center',
    p: 4,
  })
);
