import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { SearchContextProvider } from './context';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Search({ initialValue }: { initialValue?: string }) {
  const [heightRef, { height }] = useResizeObserver<HTMLDivElement>();
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

            <Box
              boxShadow="tile"
              display={context.showResults ? 'block' : 'none'}
            >
              <SearchResults />
            </Box>
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
    zIndex: 10,
    background: 'white',
  })
);
