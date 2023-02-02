import styled from 'styled-components';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
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
  flex-direction: ${asResponsiveArray({ _: 'column', sm: 'row' })};
  & > :not(:last-child): {
    margin-bottom: ${asResponsiveArray({ _: space[5], xs: '0' })};
  }
`;
