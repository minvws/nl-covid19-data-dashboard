import styled from 'styled-components';
import { mediaQueries, space } from '~/style/theme';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useSearchContext } from './context';
import { HitList } from './hit-list';

export function SearchResults() {
  const { id, setHasHitFocus } = useSearchContext();

  useHotkey('esc', () => setHasHitFocus(false), { preventDefault: false });

  return (
    <StyledSearchResults id={id} role="listbox" onPointerDown={() => setHasHitFocus(true)}>
      <HitList key="vr" scope="vr" />
      <HitList key="gm" scope="gm" />
    </StyledSearchResults>
  );
}

const StyledSearchResults = styled.div`
  padding: 1em 0;
  position: relative;
  display: flex;
  flex-direction: column;

  @media ${mediaQueries.sm} {
    flex-direction: row;
  }

  & > :not(:last-child): {
    margin-bottom: ${space[5]};

    @media ${mediaQueries.xs} {
      margin-bottom: 0;
    }
  }
`;
