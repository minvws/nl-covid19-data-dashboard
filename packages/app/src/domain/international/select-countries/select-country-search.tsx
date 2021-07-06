import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components/base';
import { useIsMounted } from '~/utils/use-is-mounted';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { CountryOption, SearchContextProvider } from './context';
import { SelectCountriesInput } from './select-countries-input';
import { SelectCountriesResults } from './select-country-results';

export function SelectCountrySearch({
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
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
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
              <SelectCountriesInput />
            </Box>

            <Box
              boxShadow="tile"
              display={context.showResults ? 'block' : 'none'}
            >
              <SelectCountriesResults />
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
