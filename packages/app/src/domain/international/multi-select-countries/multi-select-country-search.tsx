import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { CountryOption, SearchContextProvider } from './context';
import { MultiSelectCountriesInput } from './mult-select-countries-input';
import { MultiSelectCountriesResults } from './multi-select-country-results';

export function MultiSelectCountrySearch({
  initialValue,
  countries,
  onToggleCountry,
  limit,
}: {
  onToggleCountry: (data: CountryOption) => void;
  initialValue?: string;
  countries: CountryOption[];
  limit?: number;
}) {
  const [heightRef, { height }] = useResizeObserver<HTMLDivElement>();
  const containerRef = useRef<HTMLFormElement>(null);

  const isMounted = useIsMounted();
  const breakpoints = useBreakpoints();

  return (
    <SearchContextProvider
      containerRef={containerRef}
      initialValue={initialValue}
      onToggleCountry={onToggleCountry}
      countries={countries}
      limit={limit}
    >
      {(context) => (
        <SearchForm
          ref={containerRef}
          height={height}
          isFloating={isMounted && breakpoints.md}
        >
          <Box {...context.comboboxProps}>
            <Box position="relative" ref={heightRef}>
              <MultiSelectCountriesInput />
            </Box>

            <Box
              boxShadow="tile"
              display={context.showResults ? 'block' : 'none'}
            >
              <MultiSelectCountriesResults />
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

const StyledSearchContainer = styled.li<{ isFloating: boolean }>((x) =>
  css({
    position: x.isFloating ? 'absolute' : 'relative',
    width: '100%',
    borderRadius: 1,
    zIndex: 10,
    background: 'white',
    minWidth: 300,
    maxWidth: 300,
  })
);
