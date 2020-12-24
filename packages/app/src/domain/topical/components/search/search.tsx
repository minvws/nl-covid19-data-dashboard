import css from '@styled-system/css';
import {
  FormEvent,
  forwardRef,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { Box } from '~/components-styled/base';
import { useIsMounted } from '~/utils/use-is-mounted';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import siteText from '~/locale';
import { useOnClickOutside } from '~/utils/use-on-click-outside';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { Option, useSearchResults } from './use-search-results';
import { useRouter } from 'next/router';
import { useHitFocus } from './use-hit-focus';

export function Search() {
  const containerRef = useRef<HTMLFormElement>(null);
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
  const [value, setValue] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHitFocus, setHasHitFocus] = useState(false);
  const [valueSubmitted, setValueSubmitted] = useState<string>();
  const isMounted = useIsMounted();
  const breakpoints = useBreakpoints();
  const router = useRouter();

  const {
    hits,
    vrHits,
    gmHits,
    focusIndex,
    focusRef,
    setFocusIndex,
  } = useSearchResults(value, (option, openInNewWindow) => {
    setValueSubmitted(option.data.name);

    return openInNewWindow
      ? window.open(option.data.link, '_blank')
      : router.push(option.data.link);
  });

  useOnClickOutside([containerRef], () => setHasHitFocus(false));

  const showResults = value; //&& (hasFocus || hasHitFocus || !breakpoints.md);

  const ariaControlsId = useRef(`id-search`);

  return (
    <SearchForm
      ref={containerRef}
      height={height}
      isFloating={isMounted && breakpoints.md}
    >
      <Box
        role="combobox"
        aria-expanded={showResults ? 'true' : 'false'}
        aria-haspopup="grid"
        aria-owns={ariaControlsId.current}
      >
        <SearchInput
          ref={heightRef}
          value={valueSubmitted || value}
          placeholder={siteText.search.placeholder}
          onChange={setValue}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          ariaControls={ariaControlsId.current}
          focusIndex={focusIndex}
          isDisabled={!!valueSubmitted}
        />
        {showResults && (
          <SearchResults
            id={ariaControlsId.current}
            value={value}
            onHasHitFocusChange={setHasHitFocus}
            hits={hits}
            vrHits={vrHits}
            gmHits={gmHits}
            focusIndex={focusIndex}
            focusRef={focusRef}
            setFocusIndex={setFocusIndex}
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
