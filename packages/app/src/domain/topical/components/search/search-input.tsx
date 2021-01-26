import css from '@styled-system/css';
import { MouseEvent, useRef } from 'react';
import styled from 'styled-components';
import CloseIcon from '~/assets/close.svg';
import SearchIcon from '~/assets/search-icon.svg';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { default as siteText, default as text } from '~/locale';
import { useSearchContext } from './context';

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

export function SearchInput() {
  const { id, inputProps, setTerm } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box position="relative">
      <IconContainer align="left">
        <SearchIcon />
      </IconContainer>

      {!inputProps.disabled && inputProps.value && (
        <IconContainer
          as="button"
          align="right"
          onClick={(evt: MouseEvent<HTMLButtonElement>) => {
            evt.stopPropagation();
            inputRef.current?.focus();
            setTerm('');
          }}
        >
          <VisuallyHidden>{text.search.clear}</VisuallyHidden>
          <CloseIcon />
        </IconContainer>
      )}

      <VisuallyHidden>
        <label htmlFor={`${id}-input`}>
          <Text>{siteText.search.placeholder}</Text>
        </label>
      </VisuallyHidden>

      <StyledSearchInput
        ref={inputRef}
        type="search"
        id={`${id}-input`}
        placeholder={siteText.search.placeholder}
        autoComplete="off"
        {...inputProps}
      />
    </Box>
  );
}

export const paddedStyle = css({
  p: ['1rem', null, null, '1.5rem'],
  px: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

const StyledSearchInput = styled.input(
  paddedStyle,
  css({
    display: 'block',
    width: '100%',
    borderRadius: 1,
    border: `solid`,
    borderWidth: '1px',
    borderColor: 'lightGray',
    fontSize: ['1rem', null, null, '1.125rem'],
    m: 0,
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
    '&::-ms-clear': {
      display: 'none',
    },
  })
);

const IconContainer = styled.div<{ align: 'left' | 'right' }>((x) =>
  css({
    zIndex: 1,
    color: 'black',
    position: 'absolute',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
    pointerEvents: x.onClick ? 'all' : 'none',

    top: 0,
    left: x.align === 'left' ? 0 : undefined,
    right: x.align === 'right' ? 0 : undefined,

    background: 'none',
    border: 0,
    p: 0,
    m: 0,
    cursor: 'pointer',

    svg: {
      width: 24,
      height: 24,
    },
  })
);
