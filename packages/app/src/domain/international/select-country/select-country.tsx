import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { SelectCountryInput } from './select-country-input';

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
  const containerRef = useRef(null);

  useOnClickOutside([containerRef], () => setIsOpen(false));

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

  const handleOnClick = (item: Option) => {
    onChange(item.value);
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={containerRef}>
      <SelectCountryInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        currentOption={currentOption}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {isOpen && (
        <OrderedList>
          {matchingCountries.length > 0 ? (
            <>
              {options
                .filter((item) => matchingCountries.includes(item.value))
                .map((item, index) => (
                  <ListItem key={index}>
                    <Button onClick={() => handleOnClick(item)}>
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
                    </Button>
                  </ListItem>
                ))}
            </>
          ) : (
            <ListItem css={css({ px: 3, py: 2 })}>Geen match</ListItem>
          )}
        </OrderedList>
      )}
    </Box>
  );
}

const OrderedList = styled.ol(
  css({
    backgroundColor: 'white',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    border: `1px solid silver`,
    borderTopColor: 'transparent',
    position: 'absolute',
    width: '100%',
    top: '100%',
    zIndex: 10,
    m: 0,
    p: 0,
    maxHeight: '20em',
    overflow: 'auto',
  })
);

const ListItem = styled.li(
  css({
    display: 'flex',
  })
);

const Button = styled.button<{
  hasFocus?: boolean;
}>((x) =>
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
