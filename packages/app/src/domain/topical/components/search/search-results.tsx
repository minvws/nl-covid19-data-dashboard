import css from '@styled-system/css';
import styled from 'styled-components';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { useSearchContext } from './context';
import { HitList } from './hit-list';
import { paddedStyle } from './search-input';

export function SearchResults() {
  const { id, hits, setHasHitFocus } = useSearchContext();
  const breakpoints = useBreakpoints();

  useHotkey('esc', () => setHasHitFocus(false), { preventDefault: false });

  /**
   * On narrow devices we'll render the category with the best result on top
   */
  const vrHasBestResult =
    [...hits].sort((a, b) => b.score - a.score)[0]?.data.type === 'vr';

  const col1Scope = breakpoints.md ? 'gm' : vrHasBestResult ? 'vr' : 'gm';
  const col2Scope = breakpoints.md ? 'vr' : vrHasBestResult ? 'gm' : 'vr';

  return (
    <StyledSearchResults
      id={id}
      role="listbox"
      onPointerDown={() => setHasHitFocus(true)}
    >
      <HitList key={col1Scope} scope={col1Scope} />
      <HitList key={col2Scope} scope={col2Scope} />
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
