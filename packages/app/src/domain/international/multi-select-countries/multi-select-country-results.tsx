import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Checked } from '@corona-dashboard/icons';
import { Unchecked } from '@corona-dashboard/icons';
import { Box } from '~/components/base';
import { Text } from '~/components/typography';
import { Flag } from '~/domain/international/flag';
import { useIntl } from '~/intl';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useSearchContext } from './context';

export function MultiSelectCountriesResults() {
  const {
    id,
    hits,
    setHasHitFocus,
    onToggleCountry,
    getOptionProps,
    limit,
    selectedCount,
  } = useSearchContext();

  const { formatNumber, commonTexts } = useIntl();

  useHotkey('esc', () => setHasHitFocus(false), { preventDefault: false });

  const isLimitReached = selectedCount >= limit;

  return (
    <StyledSelectCountriesResults
      id={id}
      role="listbox"
      aria-multiselectable="true"
      onPointerDown={() => setHasHitFocus(true)}
    >
      <StyledCountriesList>
        {hits.length > 0 ? (
          <StyledHitList>
            {hits.map((x) => (
              <li key={x.id}>
                <Hit
                  {...getOptionProps(x)}
                  onClick={() => onToggleCountry(x.data)}
                  isLimitReached={isLimitReached}
                >
                  <span css={css({ flex: '0 0 24px', mt: 1 })}>
                    {x.data.isSelected ? <Checked /> : <Unchecked />}
                  </span>
                  <Box mr={2}>
                    <Flag countryCode={x.id} />
                  </Box>
                  <span
                    css={css({
                      color: 'black',
                      flexGrow: 1,
                      fontWeight: x.data.isSelected ? 'bold' : 'normal',
                    })}
                  >
                    {x.data.name}
                  </span>
                  <span css={css({ flex: '0 0 1rem' })}>
                    {formatNumber(x.data.lastValue, 1)}
                  </span>
                </Hit>
              </li>
            ))}
          </StyledHitList>
        ) : (
          <StyledNoHits>
            <Text variant="label1">
              {commonTexts.select_countries.no_countries_found}
            </Text>
            <Text variant="label1">
              {commonTexts.select_countries.no_countries_found_hint}
            </Text>
          </StyledNoHits>
        )}
      </StyledCountriesList>
      <StyledSelectionSummary>
        {replaceVariablesInText(
          commonTexts.select_countries.selection_summary,
          {
            selectedCount,
            limit,
          }
        )}
      </StyledSelectionSummary>
    </StyledSelectCountriesResults>
  );
}

const StyledSelectCountriesResults = styled.div(css({}));

const StyledCountriesList = styled.div(
  css({
    maxHeight: '20em',
    overflow: 'auto',
  })
);

const StyledSelectionSummary = styled.div(
  css({
    p: 1,
    textAlign: 'center',
    borderTop: '1px solid',
    borderTopColor: 'lightGray',
    fontSize: 1,
  })
);

const StyledNoHits = styled.div(
  css({
    color: 'gray',
    textAlign: 'center',
    p: 4,
  })
);

interface HitProps {
  children: ReactNode;
  hasFocus: boolean;
  onHover: () => void;
  onFocus: () => void;
  id: string;
  onClick: () => void;
  isSelected: boolean;
  isLimitReached: boolean;
}

function Hit({
  children,
  hasFocus,
  onHover,
  onFocus,
  onClick,
  id,
  isSelected,
  isLimitReached,
}: HitProps) {
  return (
    <StyledHit
      hasFocus={hasFocus}
      isSelected={isSelected}
      onFocus={onFocus}
      onMouseMove={onHover}
      onClick={onClick}
      role="option"
      id={id}
      aria-selected={isSelected ? 'true' : 'false'}
      isLimitReached={isLimitReached}
    >
      {children}
    </StyledHit>
  );
}

const StyledHit = styled.button<{
  hasFocus: boolean;
  isSelected: boolean;
  isLimitReached: boolean;
}>((x) =>
  css({
    px: 3,
    py: 2,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'annotation',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'white',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
    border: 'none',
    textAlign: 'left',
    opacity: x.isLimitReached && !x.isSelected ? 0.5 : 1,
    fontFamily: 'inherit',
    fontSize: '1em',
  })
);

const StyledHitList = styled.ol(
  css({
    listStyle: 'none',
    m: 0,
    p: 0,
  })
);
