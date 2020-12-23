import css from '@styled-system/css';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import text from '~/locale';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { HitList } from './hit-list';
import { paddedStyle } from './search-input';
import { useHitFocus } from './use-hit-focus';
import { useSearchResults } from './use-search-results';

interface SearchResultsProps {
  value: string;
  onHasHitFocusChange: (hasFocus: boolean) => void;
  id: string;
}

export function SearchResults({
  value,
  onHasHitFocusChange,
  id,
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
    <StyledSearchResults
      role="listbox"
      id={id}
      onPointerDown={() => onHasHitFocusChange(true)}
    >
      <HitList
        hits={gmHits}
        title={text.common.gm_plural}
        focusIndex={focusIndex}
        focusRef={focusRef}
        noHitsMessage={replaceVariablesInText(text.search.no_hits, {
          search: value,
          subject: text.common.gm_plural,
        })}
        onHover={setFocusIndex}
        onFocus={(index) => {
          onHasHitFocusChange(true);
          setFocusIndex(index);
        }}
      />

      <HitList
        hits={vrHits}
        title={text.common.vr_plural}
        focusIndex={focusIndex}
        focusRef={focusRef}
        noHitsMessage={replaceVariablesInText(text.search.no_hits, {
          search: value,
          subject: text.common.vr_plural,
        })}
        onHover={setFocusIndex}
        onFocus={(index) => {
          onHasHitFocusChange(true);
          setFocusIndex(index);
        }}
      />
    </StyledSearchResults>
  );
}

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
