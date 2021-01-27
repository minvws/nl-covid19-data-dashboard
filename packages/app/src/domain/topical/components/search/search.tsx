import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components-styled/base';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { SearchContextProvider } from './context';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Search({ initialValue }: { initialValue?: string }) {
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
  const containerRef = useRef<HTMLFormElement>(null);

  const isMounted = useIsMounted();
  const breakpoints = useBreakpoints();

  return (
    <SearchContextProvider
      containerRef={containerRef}
      initialValue={initialValue}
    >
      {(context) => (
        <SearchForm
          ref={containerRef}
          height={height}
          isFloating={isMounted && breakpoints.md}
        >
          <Box {...context.comboboxProps}>
            <Box position="relative" ref={heightRef}>
              <SearchInput />
            </Box>
            {context.showResults && <SearchResults />}
          </Box>
        </SearchForm>
      )}
    </SearchContextProvider>
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
