import css from '@styled-system/css';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components-styled/base';
import { useIsMounted } from '~/utils/use-is-mounted';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Search() {
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
  const [value, setValue] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHitFocus, setHasHitFocus] = useState(false);
  const isMounted = useIsMounted();

  const showResults = value && (hasFocus || hasHitFocus);

  return (
    <SearchForm height={height} isFloating={isMounted}>
      <SearchInput
        ref={heightRef}
        value={value}
        onChange={setValue}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setTimeout(() => setHasFocus(false), 100)}
      />
      {showResults && (
        <SearchResults value={value} onHasHitFocusChange={setHasHitFocus} />
      )}
    </SearchForm>
  );
}

interface SearchContainerProps {
  children: ReactNode;
  isFloating: boolean;
  height?: number;
}

function SearchForm({ children, height, isFloating }: SearchContainerProps) {
  return (
    <form
      css={css({ position: 'relative' })}
      onSubmit={(evt) => evt.preventDefault()}
    >
      <StyledSearchContainer isFloating={isFloating}>
        {children}
      </StyledSearchContainer>
      {isFloating && <Box height={height} />}
    </form>
  );
}

const StyledSearchContainer = styled.div<{ isFloating: boolean }>((x) =>
  css({
    position: x.isFloating ? 'absolute' : 'relative',
    width: '100%',
    borderRadius: 1,
    boxShadow: 'tile',
    border: '1px solid #ECECEC',
    zIndex: 10,
  })
);
