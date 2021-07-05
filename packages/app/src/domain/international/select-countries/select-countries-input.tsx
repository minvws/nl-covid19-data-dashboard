import css from '@styled-system/css';
import { MouseEvent, useRef } from 'react';
import styled from 'styled-components';
import CloseIcon from '~/assets/close.svg';
import SearchIcon from '~/assets/search-icon-bold.svg';
import { Box } from '~/components/base';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { useSearchContext } from './context';

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

export function SelectCountriesInput() {
  const { siteText } = useIntl();
  const { id, inputProps, setTerm } = useSearchContext();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box position="relative">
      <IconContainer align="left">
        <SearchIcon />
      </IconContainer>

      {inputProps.value && (
        <IconContainer
          as="button"
          align="right"
          onClick={(evt: MouseEvent) => {
            evt.stopPropagation();
            inputRef.current?.focus();
            setTerm('');
          }}
        >
          <VisuallyHidden>{siteText.search.clear}</VisuallyHidden>
          <CloseIcon />
        </IconContainer>
      )}

      <VisuallyHidden>
        <label htmlFor={`${id}-input`}>{siteText.search.placeholder}</label>
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
  p: '1rem',
  px: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

// const StyledSearchInput = styled.input(
//   paddedStyle,
//   css({
//     fontFamily: 'body',
//     display: 'block',
//     width: '100%',
//     borderRadius: 1,
//     border: `solid`,
//     borderWidth: '1px',
//     borderColor: 'lightGray',
//     fontSize: ['1rem', null, null, '1.125rem'],
//     appearance: 'none',
//     m: 0,
//     '&::-webkit-search-cancel-button': {
//       display: 'none',
//     },
//     '&::-ms-clear': {
//       display: 'none',
//     },
//     '&:placeholder-shown': {
//       pr: 2,
//       boxShadow: 'tile',
//     },
//   })
// );

// const IconContainer = styled.div<{ align: 'left' | 'right' }>((x) =>
//   css({
//     zIndex: 1,
//     color: 'black',
//     position: 'absolute',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
//     pointerEvents: x.onClick ? 'all' : 'none',

//     top: 0,
//     left: x.align === 'left' ? 0 : undefined,
//     right: x.align === 'right' ? 0 : undefined,

//     background: 'none',
//     border: 0,
//     p: 0,
//     m: 0,
//     cursor: 'pointer',

//     svg: {
//       width: 24,
//       height: 24,
//     },
//   })
// );

const StyledSearchInput = styled.input(
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
  })
);
