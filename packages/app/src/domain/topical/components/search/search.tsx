import { colors } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { forwardRef, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { useResizeObserver } from '~/utils/use-resize-observer';
import { SearchContextProvider } from './context';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';

export function Search({
  initialValue,
  title,
}: {
  initialValue?: string;
  title: string;
}) {
  const [heightRef, { height }] = useResizeObserver<HTMLDivElement>();
  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <SearchContextProvider
      containerRef={containerRef}
      initialValue={initialValue}
    >
      {(context) => (
        <Box spacing={3}>
          <Box
            display="flex"
            justifyContent={{ _: 'start', xs: 'center' }}
            textAlign={{ xs: 'center' }}
          >
            <Heading as="h3" level={5}>
              {title}
            </Heading>
          </Box>

          <Box
            display="flex"
            justifyContent={{ _: 'start', xs: 'center' }}
            alignItems={{ _: 'start', xs: 'center' }}
            position="relative"
            width="100%"
            zIndex={10}
          >
            <Box
              width={{
                _: '100%',
                xs: '20rem',
                sm: context.showResults ? '42rem' : '26rem',
              }}
              px={{ sm: 4 }}
              bg={colors.white}
              position="relative"
              zIndex={1}
            >
              <SearchForm ref={containerRef} height={height} isFloating>
                <Box {...context.comboboxProps}>
                  <Box position="relative" ref={heightRef}>
                    <SearchInput />
                  </Box>

                  <Box
                    display={context.showResults ? 'block' : 'none'}
                    borderColor="blue"
                    borderStyle="solid"
                    borderWidth="1px"
                    borderTopColor="border"
                    borderRadius={1}
                    borderTopLeftRadius={0}
                    borderTopRightRadius={0}
                    // make sure the input and results bottom and top borders overlap
                    my={'-1px'}
                  >
                    <SearchResults />
                  </Box>
                </Box>
              </SearchForm>
            </Box>
          </Box>
        </Box>
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
        css={css({
          position: 'relative',
        })}
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
