import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { useSearchContext } from './context';
import { HitList } from './hit-list';

export function SearchResults() {
  const { id, setHasHitFocus } = useSearchContext();

  useHotkey('esc', () => setHasHitFocus(false), { preventDefault: false });

  return (
    <StyledSearchResults
      id={id}
      role="listbox"
      onPointerDown={() => setHasHitFocus(true)}
    >
      <HitList key="vr" scope="vr" />
      <HitList key="gm" scope="gm" />
    </StyledSearchResults>
  );
}

const StyledSearchResults = styled.div(
  css({
    p: '1em 0',
    position: 'relative',
    display: 'flex',
    flexDirection: asResponsiveArray({ _: 'column', sm: 'row' }),
    '& > :not(:last-child)': {
      marginBottom: ['2em', 0],
    },
  })
);
