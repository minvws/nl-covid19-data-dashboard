import css from '@styled-system/css';
import matchSorter from 'match-sorter';
import {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import useResizeObserver from 'use-resize-observer/polyfilled';
import SearchIcon from '~/assets/search-icon.svg';
import { Box } from '~/components-styled/base';
import { Text } from '~/components-styled/typography';
import municipalities from '~/data/gemeente_veiligheidsregio.json';
import safetyRegions from '~/data/index';
import { useHotkey } from '~/utils/hotkey/use-hotkey';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

interface Option {
  type: 'gm' | 'vr';
  code: string;
  name: string;
  link: string;
  searchTerms: string[];
}

interface Hit<T> {
  index: number;
  score: number;
  id: string;
  data: T;
}

const text = {
  municipality_header: 'Gemeentes',
  safety_region_header: "Veiligheidsregio's",

  municipality_no_hits: 'Geen gemeentes gevonden met “{{search}}”',
  safety_region_no_hits: "Geen veiligheidsregio's gevonden met “{{search}}”",
};

const options: Option[] = [
  ...[],
  ...municipalities.map((x) => ({
    type: 'gm' as const,
    code: x.gemcode,
    name: x.displayName || x.name,
    searchTerms: [x.name, x.displayName].filter(isPresent),
    link: `/gemeente/${x.gemcode}/actueel`,
  })),
  ...safetyRegions.map((x) => ({
    type: 'vr' as const,
    code: x.code,
    name: x.name,
    searchTerms: [x.name, ...(x.searchTerms || [])].filter(isPresent),
    link: `/veiligheidsregio/${x.code}/actueel`,
  })),
];

const ICON_SPACE = 50;
const ICON_SPACE_LARGE = 66;

export function Search() {
  const [isMounted, setIsMounted] = useState(false);
  const { height, ref: heightRef } = useResizeObserver<HTMLDivElement>();
  const [value, setValue] = useState('');

  const { gmHits, vrHits, hits } = useSearchResults(value, options);

  const hitWithFocusRef = useRef<HTMLAnchorElement>(null);

  const [focusIndex, setFocusIndex] = useState(0);
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHitFocus, setHasHitFocus] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    /**
     * On input-change we'll reset the focus index to 0. It's possible that
     * there is a stronger hit among the VR hits (2nd column). If so, we won't
     * reset the index to 0, instead it will be set to the index of that hit.
     */
    const index = vrHits[0]?.score === 1 ? vrHits[0].index : 0;

    setFocusIndex(index);
    setHasHitFocus(false);
  }, [value, vrHits, gmHits]);

  useHotkey(
    'up',
    () => {
      console.log('uppp');
      const nextIndex = focusIndex - 1;
      const nextHit = hits[nextIndex] || hits[hits.length - 1];

      setFocusIndex(nextHit.index);
      maybeScrollIntoView(hitWithFocusRef.current);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'down',
    () => {
      console.log('downnnn');
      const nextIndex = focusIndex + 1;
      const nextHit = hits[nextIndex] || hits[0];

      setFocusIndex(nextHit.index);
      maybeScrollIntoView(hitWithFocusRef.current);
    },
    { allowRepeat: true }
  );

  useHotkey(
    'enter',
    () => {
      console.log('enterrr');
      hitWithFocusRef.current && hitWithFocusRef.current.click();
    },
    { allowRepeat: true }
  );

  useHotkey(
    'command+enter',
    () => {
      hitWithFocusRef.current &&
        window.open(hitWithFocusRef.current.href, '_blank');
    },
    { allowRepeat: true }
  );

  useHotkey(
    'control+enter',
    () => {
      hitWithFocusRef.current &&
        window.open(hitWithFocusRef.current.href, '_blank');
    },
    { allowRepeat: true }
  );

  const showResults = value && (hasFocus || hasHitFocus);

  return (
    <form
      css={css({ position: 'relative' })}
      onSubmit={(evt) => evt.preventDefault()}
    >
      <SearchContainer isFloating={isMounted}>
        <SearchInput
          ref={heightRef}
          value={value}
          onChange={setValue}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setTimeout(() => setHasFocus(true), 0)}
        />
        {showResults && (
          <SearchResults>
            <HitList title={text.municipality_header}>
              {gmHits.length > 0 ? (
                <StyledHitList>
                  {gmHits.map((x) => (
                    <li key={x.id}>
                      <HitLink
                        ref={
                          x.index === focusIndex ? hitWithFocusRef : undefined
                        }
                        href={x.data.link}
                        name={x.data.name}
                        hasFocus={focusIndex === x.index}
                        onHover={() => setFocusIndex(x.index)}
                        onFocus={() => {
                          setHasHitFocus(true);
                          setFocusIndex(x.index);
                        }}
                      />
                    </li>
                  ))}
                </StyledHitList>
              ) : (
                <Text color="gray">
                  {replaceVariablesInText(text.municipality_no_hits, {
                    search: value,
                  })}
                </Text>
              )}
            </HitList>
            <HitList title={text.safety_region_header}>
              {vrHits.length > 0 ? (
                <StyledHitList>
                  {vrHits.map((x) => (
                    <li key={x.id}>
                      <HitLink
                        ref={
                          x.index === focusIndex ? hitWithFocusRef : undefined
                        }
                        href={x.data.link}
                        name={x.data.name}
                        hasFocus={focusIndex === x.index}
                        onHover={() => setFocusIndex(x.index)}
                        onFocus={() => {
                          setHasHitFocus(true);
                          setFocusIndex(x.index);
                        }}
                      />
                    </li>
                  ))}
                </StyledHitList>
              ) : (
                <Text color="gray">
                  {replaceVariablesInText(text.safety_region_no_hits, {
                    search: value,
                  })}
                </Text>
              )}
            </HitList>
          </SearchResults>
        )}
      </SearchContainer>
      <div style={{ height: isMounted ? height : 0 }} />
    </form>
  );
}

const SearchContainer = styled.div<{ isFloating: boolean }>((x) =>
  css({
    position: x.isFloating ? 'absolute' : 'relative',
    width: '100%',
    borderRadius: 1,
    boxShadow: 'tile',
    border: '1px solid #ECECEC',
    zIndex: 10,
  })
);

interface HitListProps {
  title: string;
  children: ReactNode;
}

function HitList({ title, children }: HitListProps) {
  return (
    <Box spacing={3} mx={-2}>
      <span
        css={css({
          display: 'block',
          textTransform: 'uppercase',
          fontSize: 1,
          fontWeight: 'bold',
          px: 2,
        })}
      >
        {title}
      </span>
      {children}
    </Box>
  );
}

const StyledHitList = styled.ol(
  css({
    listStyle: 'none',
    p: 0,
    m: 0,
    width: ['100%', null, null, 320],
  })
);

interface HitLinkProps {
  href: string;
  name: string;
  hasFocus: boolean;
  onHover: () => void;
  onFocus: () => void;
}

const HitLink = forwardRef<HTMLAnchorElement, HitLinkProps>(
  ({ href, name, hasFocus, onHover, onFocus }, ref) => {
    return (
      <Link passHref href={href}>
        <StyledHitLink
          ref={ref}
          hasFocus={hasFocus}
          onFocus={onFocus}
          onMouseMove={onHover}
        >
          {name}
        </StyledHitLink>
      </Link>
    );
  }
);

const StyledHitLink = styled.a<{ hasFocus: boolean }>((x) =>
  css({
    p: 2,
    display: 'block',
    textDecoration: 'none',
    color: 'black',
    width: '100%',
    bg: x.hasFocus ? 'contextualContent' : 'transparant',
    transitionProperty: 'background',
    transitionDuration: x.hasFocus ? '0ms' : '120ms',
  })
);

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  ({ value, onChange, onFocus, onBlur }, ref) => {
    return (
      <Box position="relative" ref={ref}>
        <IconContainer>
          <SearchIcon />
        </IconContainer>
        <StyledSearchInput
          type="search"
          placeholder="Zoek een gemeente of veiligheidsregio"
          value={value}
          onChange={(x) => onChange(x.target.value)}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
        />
      </Box>
    );
  }
);

const paddedStyle = css({
  p: ['1rem', null, null, '1.5rem'],
  px: [ICON_SPACE, null, null, ICON_SPACE_LARGE],
});

const SearchResults = styled.div(
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

const StyledSearchInput = styled.input(
  paddedStyle,
  css({
    display: 'block',
    width: '100%',
    borderRadius: 1,
    border: 0,
    fontSize: [16, null, null, 18],
  })
);

const IconContainer = styled.div(
  css({
    color: 'black',
    position: 'absolute',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: ICON_SPACE,
    pointerEvents: 'none',

    svg: {
      width: 24,
      height: 24,
    },
  })
);

function useSearchResults(term: string, options: Option[]) {
  const termTrimmed = term.trim();

  return useMemo(() => {
    const hits =
      termTrimmed === ''
        ? [...options].sort((a, b) => a.name.localeCompare(b.name))
        : matchSorter(options, termTrimmed, {
            keys: ['searchTerms'],
          });

    const gmHitsSliced = hits.filter((x) => x.type === 'gm').slice(0, 10);
    const vrHitsSliced = hits.filter((x) => x.type === 'vr').slice(0, 10);

    const hitsWithIndex = [...gmHitsSliced, ...vrHitsSliced].map(
      (data, index) =>
        ({
          id: data.code,
          data,
          index,
          score: 1 - hits.indexOf(data) / hits.length,
        } as Hit<Option>)
    );

    return {
      hits: hitsWithIndex,
      gmHits: hitsWithIndex.filter((x) => x.data.type === 'gm'),
      vrHits: hitsWithIndex.filter((x) => x.data.type === 'vr'),
    };
  }, [options, termTrimmed]);
}

function maybeScrollIntoView<T extends Element>(el: T | null | undefined) {
  if (el) {
    scrollIntoView(el, {
      behavior: 'smooth',
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}
