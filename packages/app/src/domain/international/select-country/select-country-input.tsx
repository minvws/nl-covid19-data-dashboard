import css from '@styled-system/css';
import { Dispatch, SetStateAction, useRef } from 'react';
import styled from 'styled-components';
import ChevronIcon from '~/assets/chevron.svg';
import CloseIcon from '~/assets/close.svg';
import SearchIcon from '~/assets/search-icon-bold.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
// import { useIntl } from '~/intl';
import { Option } from './select-country';

interface SelectCountryInputType {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  currentOption: Option;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function SelectCountryInput({
  inputValue,
  setInputValue,
  currentOption,
  isOpen,
  setIsOpen,
}: SelectCountryInputType) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOnFocus = () => {
    setIsOpen(true);
    setInputValue('');
  };

  return (
    <Box position="relative" minWidth="14rem">
      <IconContainer align="left">
        {isOpen ? (
          <SearchIcon />
        ) : (
          <img
            aria-hidden
            src={`/icons/flags/${currentOption.value.toLowerCase()}.svg`}
            width="17"
            height="13"
            alt=""
            css={css({
              mr: 2,
            })}
          />
        )}
      </IconContainer>

      <IconContainer
        as="button"
        align="right"
        onClick={(evt: any) => {
          evt.stopPropagation();
          inputRef.current?.focus();
          setInputValue('');
        }}
      >
        {isOpen ? (
          inputValue.length > 0 && (
            <Box
              css={css({
                svg: {
                  width: 20,
                  height: 20,
                },
              })}
            >
              <VisuallyHidden>
                {'siteText.select_countries.clear'}
              </VisuallyHidden>
              <CloseIcon />
            </Box>
          )
        ) : (
          <Box
            as="span"
            transform="rotate(90deg)"
            css={css({
              svg: {
                width: 15,
                height: 15,
              },
            })}
          >
            <ChevronIcon />
          </Box>
        )}
      </IconContainer>

      <Input
        /**
         * Usually search-results will disappear when the input loses focus,
         * but this doesn't allow the user to set focus on a search-result using
         * the "tab"-key.
         * The following timeout will handle the blur-event after a small delay.
         * This allows the browser to fire a focusEvent for one of the results,
         * which in turn will keep the search-results alive.
         */
        placeholder={'select a country'}
        value={isOpen ? inputValue : currentOption.label}
        onChange={handleOnChange}
        ref={inputRef}
        onFocus={handleOnFocus}
        autoComplete="off"
      />
    </Box>
  );
}
const IconContainer = styled.div<{ align: 'left' | 'right' }>((x) =>
  css({
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: x.align === 'right' ? '12px' : undefined,
    bottom: 0,
    left: x.align === 'left' ? '10px' : undefined,

    display: 'flex',
    alignItems: 'center',

    m: 0,
    p: 0,
    height: '100%',

    background: 'none',

    color: x.align === 'left' ? 'labelGray' : 'icon',

    border: 'none',
  })
);

const Input = styled.input(
  css({
    display: 'inline-block',

    width: '100%',
    border: `1px solid silver`,
    py: 2,
    pl: '36px',
    m: 0,

    fontFamily: 'body',
    fontSize: 1,

    appearance: 'none',

    '&::-webkit-search-cancel-button': {
      display: 'none',
    },

    '&::-ms-clear': {
      display: 'none',
    },

    '&:focus': {
      borderColor: 'lightGray',
      outline: '2px dotted',
      outlineColor: 'blue',
    },
  })
);
