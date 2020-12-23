import css from '@styled-system/css';
import { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import SearchIcon from '~/assets/search-icon.svg';
import { Box } from '~/components-styled/base';
import { VisuallyHidden } from '~/components-styled/visually-hidden';

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

interface SearchInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  ariaControls: string;
}

export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  ({ value, placeholder, onChange, onFocus, onBlur, ariaControls }, ref) => {
    const id = useRef(`id-${Math.random()}`);

    return (
      <Box position="relative" ref={ref}>
        <IconContainer>
          <SearchIcon />
        </IconContainer>
        <VisuallyHidden>
          <label htmlFor={id.current}>{placeholder}</label>
        </VisuallyHidden>

        <StyledSearchInput
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(x) => onChange(x.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          id={id.current}
          aria-autocomplete="list"
          aria-controls={ariaControls}
        />
      </Box>
    );
  }
);

export const paddedStyle = css({
  p: ['1rem', null, null, '1.5rem'],
  pl: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

const StyledSearchInput = styled.input(
  paddedStyle,
  css({
    display: 'block',
    width: '100%',
    borderRadius: 1,
    border: 0,
    fontSize: [16, null, null, 18],
    m: 0,
  })
);

const IconContainer = styled.div(
  css({
    color: 'black',
    position: 'absolute',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
    pointerEvents: 'none',

    svg: {
      width: 24,
      height: 24,
    },
  })
);
