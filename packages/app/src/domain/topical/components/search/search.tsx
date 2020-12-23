import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components-styled/base';
import { useIsMounted } from '~/utils/use-is-mounted';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import siteText from '~/locale';
import { useOnClickOutside } from '~/utils/use-on-click-outside';

export function Search() {
  const containerRef = useRef<HTMLFormElement>(null);
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
  const [value, setValue] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHitFocus, setHasHitFocus] = useState(false);
  const isMounted = useIsMounted();

  useOnClickOutside([containerRef], () => setHasHitFocus(false));

  const showResults = value && (hasFocus || hasHitFocus);

  const ariaControlsId = useRef(`id-${Math.random()}`);

  return (
    <SearchForm ref={containerRef} height={height} isFloating={isMounted}>
      <Box
        role="combobox"
        aria-expanded={showResults ? 'true' : 'false'}
        aria-haspopup="listbox"
      >
        <SearchInput
          ref={heightRef}
          value={value}
          placeholder={siteText.search.placeholder}
          onChange={setValue}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          ariaControls={ariaControlsId.current}
        />
        {showResults && (
          <SearchResults
            id={ariaControlsId.current}
            value={value}
            onHasHitFocusChange={setHasHitFocus}
          />
        )}
      </Box>
    </SearchForm>
  );
}

interface SearchContainerProps {
  children: ReactNode;
  isFloating: boolean;
  height?: number;
}

const SearchForm = forwardRef<HTMLFormElement, SearchContainerProps>(
  ({ children, height, isFloating }, ref) => {
    return (
      <form
        ref={ref}
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
);

const StyledSearchContainer = styled.div<{ isFloating: boolean }>((x) =>
  css({
    position: x.isFloating ? 'absolute' : 'relative',
    width: '100%',
    borderRadius: 1,
    boxShadow: 'tile',
    zIndex: 10,
    background: 'white',
  })
);
