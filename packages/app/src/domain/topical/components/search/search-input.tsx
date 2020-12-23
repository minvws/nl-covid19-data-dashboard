import css from '@styled-system/css';
import { forwardRef } from 'react';
import styled from 'styled-components';
import SearchIcon from '~/assets/search-icon.svg';
import { Box } from '~/components-styled/base';

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  ({ value, onChange, onFocus, onBlur }, ref) => {
    return (
      <Box position="relative" ref={ref}>
        <IconContainer>
          <SearchIcon />
        </IconContainer>
        <StyledSearchInput
          type="search"
          placeholder="Zoek een gemeente of veiligheidsregio"
          value={value}
          onChange={(x) => onChange(x.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Box>
    );
  }
);

const paddedStyle = css({
  p: ['1rem', null, null, '1.5rem'],
  px: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

const StyledSearchInput = styled.input(
  paddedStyle,
  css({
    display: 'block',
    width: '100%',
    borderRadius: 1,
    border: 0,
    fontSize: [16, null, null, 18],
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
    width: ICON_SPACE,
    pointerEvents: 'none',

    svg: {
      width: 24,
      height: 24,
    },
  })
);
