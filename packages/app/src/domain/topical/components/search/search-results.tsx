import css from '@styled-system/css';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { HitList } from './hit-list';
import { useHitFocus } from './use-hit-focus';
import { useSearchResults } from './use-search-results';

const text = {
  municipality_header: 'Gemeentes',
  safety_region_header: "Veiligheidsregio's",

  municipality_no_hits: 'Geen gemeentes gevonden met “{{search}}”',
  safety_region_no_hits: "Geen veiligheidsregio's gevonden met “{{search}}”",
};

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

interface SearchResultsProps {
  value: string;
  onHasHitFocusChange: (hasFocus: boolean) => void;
}

export function SearchResults({
  value,
  onHasHitFocusChange,
}: SearchResultsProps) {
  const onHasHitFocusChangeRef = useRef(onHasHitFocusChange);
  const { gmHits, vrHits, hits } = useSearchResults(value);
  const { focusRef, focusIndex, setFocusIndex } = useHitFocus(hits.length);

  useEffect(() => {
    onHasHitFocusChangeRef.current = onHasHitFocusChange;
  }, [onHasHitFocusChange]);

  useEffect(() => {
    /**
     * On input-change we'll reset the focus index to 0. It's possible that
     * there is a stronger hit among the VR hits (2nd column). If so, we won't
     * reset the index to 0, instead it will be set to the index of that hit.
     */
    const index = vrHits[0]?.score === 1 ? vrHits[0].index : 0;

    setFocusIndex(index);
    onHasHitFocusChangeRef.current(false);
  }, [setFocusIndex, value, vrHits]);

  useHotkey(
    'esc',
    () => {
      onHasHitFocusChangeRef.current(false);
    },
    { preventDefault: false }
  );

  return (
    <StyledSearchResults>
      <HitList
        hits={gmHits}
        title={text.municipality_header}
        focusIndex={focusIndex}
        focusRef={focusRef}
        noHitsMessage={replaceVariablesInText(text.municipality_no_hits, {
          search: value,
        })}
        onHover={(index) => setFocusIndex(index)}
        onFocus={(index) => {
          onHasHitFocusChange(true);
          setFocusIndex(index);
        }}
      />

      <HitList
        hits={vrHits}
        title={text.safety_region_header}
        focusIndex={focusIndex}
        focusRef={focusRef}
        noHitsMessage={replaceVariablesInText(text.safety_region_no_hits, {
          search: value,
        })}
        onHover={(index) => setFocusIndex(index)}
        onFocus={(index) => {
          onHasHitFocusChange(true);
          setFocusIndex(index);
        }}
      />
    </StyledSearchResults>
  );
}

const paddedStyle = css({
  p: ['1rem', null, null, '1.5rem'],
  px: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

const StyledSearchResults = styled.div(
  paddedStyle,
  css({
    bg: 'white',
    display: 'flex',
    flexDirection: ['column', null, null, 'row'],
    '& > *:not(:last-child)': {
      marginRight: [null, null, null, 4],
      marginBottom: [4, null, null, 0],
    },
  })
);
