import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Text } from '~/components/typography';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useSearchContext } from './context';
import { paddedStyle } from './select-countries-input';

export function SelectCountriesResults() {
  const { id, hits, setHasHitFocus, onSelectCountry, getOptionProps } =
    useSearchContext();

  useHotkey('esc', () => setHasHitFocus(false), { preventDefault: false });

  const selectedCount = hits.filter((c) => c.data.isSelected).length;

  const noHitsMessage = 'Nope :-(';

  return (
    <StyledSelectCountriesResults
      id={id}
      role="listbox"
      onPointerDown={() => setHasHitFocus(true)}
    >
      <StyledCountriesList>
        {hits.length > 0 ? (
          <StyledHitList>
            {hits.map((x) => (
              <li key={x.id}>
                <Hit
                  {...getOptionProps(x)}
                  onClick={() => onSelectCountry(x.data)}
                >
                  {x.data.isSelected ? 'V ' : ''}
                  {x.data.name}
                </Hit>
              </li>
            ))}
          </StyledHitList>
        ) : (
          <Text color="gray">{noHitsMessage}</Text>
        )}
      </StyledCountriesList>
      <StyledSelectionSummary>
        {replaceVariablesInText(
          '{{selectedCount}} of {{maxSelectable}} selected',
          { selectedCount, maxSelectable: 10 }
        )}
      </StyledSelectionSummary>
    </StyledSelectCountriesResults>
  );
}

const StyledSelectCountriesResults = styled.div(css({}));

const StyledCountriesList = styled.div(
  paddedStyle,
  css({
    maxHeight: '20em',
    overflow: 'auto',
  })
);

const StyledSelectionSummary = styled.div(
  paddedStyle,
  css({
    backgroundColor: 'gray',
  })
);

interface HitProps {
  children: ReactNode;
  hasFocus: boolean;
  onHover: () => void;
  onFocus: () => void;
  id: string;
  onClick: () => void;
}

function Hit({ children, hasFocus, onHover, onFocus, onClick, id }: HitProps) {
  return (
    <StyledHit
      hasFocus={hasFocus}
      onFocus={onFocus}
      onMouseMove={onHover}
      onClick={onClick}
      role="option"
      id={id}
      aria-selected={hasFocus ? 'true' : 'false'}
    >
      {children}
    </StyledHit>
  );
}

const StyledHit = styled.button<{ hasFocus: boolean }>((x) =>
  css({
    p: 2,
    display: 'block',
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'transparant',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
    background: 'none',
    border: 'none',
  })
);

const StyledHitList = styled.ol(
  css({
    listStyle: 'none',
    p: 0,
    m: 0,
    width: ['100%', null, null, 320],
  })
);
