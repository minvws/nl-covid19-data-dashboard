import css from '@styled-system/css';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import text from '~/locale';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { HitList } from './hit-list';
import { paddedStyle } from './search-input';
import { useHitFocus } from './use-hit-focus';
import { Option, useSearchResults } from './use-search-results';

interface SearchResultsProps {
  value: string;
  onHasHitFocusChange: (hasFocus: boolean) => void;
  id: string;
  onSelect: (hit: Option, openInNewWindow: boolean) => void;
}

export function SearchResults({
  id,
  value,
  onHasHitFocusChange,
  onSelect,
}: SearchResultsProps) {
  const breakpoints = useBreakpoints();
  const onHasHitFocusChangeRef = useRef(onHasHitFocusChange);
  const { gmHits, vrHits, hits } = useSearchResults(value);
  const { focusRef, focusIndex, setFocusIndex } = useHitFocus(
    hits.length,
    (index, openInNewWindow) => onSelect(hits[index].data, openInNewWindow)
  );

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

  const gmList = (
    <HitList
      key="gm"
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
  );

  const vrList = (
    <HitList
      key="vr"
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
  );

  /**
   * On narrow devices we'll render the category with the best result on top
   */
  const vrHasBestResult =
    [...hits].sort((a, b) => b.score - a.score)[0]?.data.type === 'vr';

  return (
    <StyledSearchResults
      role="listbox"
      id={id}
      onPointerDown={() => onHasHitFocusChange(true)}
    >
      {breakpoints.md ? (
        <>
          {gmList}
          {vrList}
        </>
      ) : (
        <>
          {vrHasBestResult ? vrList : gmList}
          {vrHasBestResult ? gmList : vrList}
        </>
      )}
    </StyledSearchResults>
  );
}

const StyledSearchResults = styled.div(
  paddedStyle,
  css({
    /** negative margin necessary for text alignment */
    mx: -2,
    display: 'flex',
    flexDirection: ['column', null, null, 'row'],
    '& > *:not(:last-child)': {
      marginRight: [null, null, null, 4],
      marginBottom: [4, null, null, 0],
    },
  })
);
