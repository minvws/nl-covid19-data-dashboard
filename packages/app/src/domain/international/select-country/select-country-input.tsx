import css from '@styled-system/css';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '~/assets/close.svg';
import SearchIcon from '~/assets/search-icon-bold.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';

interface SelectCountryInputType {
  value?: string;
}

export function SelectCountryInput({ value }: SelectCountryInputType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(value ?? 'Select a country');

  const handleOnChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Box position="relative">
      <IconContainer align="left">
        <SearchIcon />
      </IconContainer>

      {inputValue && (
        <IconContainer
          as="button"
          align="right"
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation();
            inputRef.current?.focus();
            setInputValue('');
          }}
          css={css({
            svg: {
              width: 20,
              height: 20,
            },
          })}
        >
          <VisuallyHidden>{'siteText.select_countries.clear'}</VisuallyHidden>
          <CloseIcon />
        </IconContainer>
      )}

      <Input
        placeholder={'select a country'}
        value={inputValue}
        onChange={handleOnChange}
        ref={inputRef}
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

    fontFamily: 'body',
    fontSize: 1,

    appearance: 'none',

    '&::-webkit-search-cancel-button': {
      display: 'none',
    },

    '&::-ms-clear': {
      display: 'none',
    },
  })
);
