import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
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
  const uniqueId = useUniqueId();

  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(value);
  const [matchingCountries, setMatchingCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = options.filter((item) => item.value === value)[0];

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

  const handleOnClick = (item: Option) => {
    setIsOpen(false);
    onChange(item.value);
  };

  useOnClickOutside([containerRef], () => handleOnClose());

  const { focusIndex, focusRef, setFocusIndex } = useHitSelection({
    isEnabled: isOpen,
    onSelectHit: (index) => {
      setIsOpen(false);
      onChange(matchingCountries[index]);
      if (inputRef.current) inputRef.current.blur();
    },
    maxPossibleItems: matchingCountries.length,
    handleOnClose,
  });

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
      />

      <OrderedList
        id={`${prefixId}_list`}
        tabIndex={-1}
        role="listbox"
        aria-labelledby={prefixId}
        isOpen={isOpen}
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
          <ListItem>Geen match</ListItem>
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

    border: `1px solid silver`,
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
    color: 'black',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'white',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
    border: 'none',
    textAlign: 'left',
    fontFamily: 'inherit',
    fontSize: '1em',

    '&:hover': {
      backgroundColor: 'contextualContent',
      cursor: 'pointer',
    },
  })
);
