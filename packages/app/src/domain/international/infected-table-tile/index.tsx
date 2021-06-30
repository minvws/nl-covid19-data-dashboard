import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Select } from '~/components/select';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowInfectedTable } from './components/narrow-infected-table';
import { SearchInput } from './components/search-input';
import { WideInfectedTable } from './components/wide-infected-table';
import {
  positiveTestedSortOptions,
  SortIdentifier,
} from './logic/sort-options';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array(10)
  .fill(null)
  .map((item, index) => {
    return {
      country_code:
        index === 3 ? 'NLD' : Math.random().toString(36).substr(2, 3),
      infected: randomIntFromInterval(10, 100),
      infected_per_100k_average: randomIntFromInterval(10, 500),
      date_start_unix: new Date(2021, 6, 19).getTime() / 1000,
      date_end_unix: new Date(2021, 6, 26).getTime() / 1000,
      date_of_insertion_unix: new Date(2021, 6, 26).getTime() / 1000,
    };
  });

export function InfectedTableTile() {
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [matchedItems, setMatchedItems] = useState(['']);

  // ADD COMMENT WHY
  // setIsExpanded(false);

  const [sortOption, setSortOption] = useState<SortIdentifier>(
    'infected_per_100k_high_to_low'
  );

  const breakpoints = useBreakpoints();

  const sortOptions = useMemo(() => {
    const sortIdentifiers = Object.keys(
      positiveTestedSortOptions
    ) as SortIdentifier[];

    return sortIdentifiers.map((id) => {
      // const label = siteText.over_risiconiveaus.scoreboard.sort_option[id];
      return {
        label: id,
        value: id,
      };
    });
  }, []); // sitetext

  useEffect(() => {
    setMatchedItems([
      ...matchSorter(
        data.map((item) => item.country_code),
        value
      ),
      'NLD', // always enable The Netherlands
    ]);
  }, [value]);

  return (
    <Tile>
      <Heading level={3}>Aantal positief geteste mensen per land</Heading>
      <Box maxWidth="maxWidthText">
        <Text>
          Deze tabel laat per land en voor Europa zien van hoeveel mensen gemeld
          is dat ze positief getest zijn op het coronavirus. Dit wordt berekend
          per 100.000 inwoners en gemiddeld over de afgelopen zeven dagen. Via
          de zoekfunctie kunt u een land selecteren.
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection={{ _: 'column', lg: 'row' }}
        justifyContent="space-between"
        mb={4}
      >
        <Box mb={{ _: 3, lg: 0 }}>
          <SearchInput
            value={value}
            setValue={setValue}
            placeholderText="Zoek een land"
          />
        </Box>

        <Box
          display="flex"
          alignItems={{ lg: 'center' }}
          flexDirection={{ _: 'column', lg: 'row' }}
        >
          <label
            css={css({
              pr: 2,
              fontSize: 1,
            })}
          >
            Sorteer op
          </label>
          <Select
            options={sortOptions}
            onChange={setSortOption}
            value={sortOption}
          />
        </Box>
      </Box>
      {breakpoints.sm ? (
        <WideInfectedTable
          data={data.sort(positiveTestedSortOptions[sortOption])}
          isExpanded={isExpanded}
          matchedItems={matchedItems}
        />
      ) : (
        <NarrowInfectedTable data={data} />
      )}

      {/* Hide the expand button when the user is searching */}
      {matchedItems.length > data.length && (
        <Box display="flex" pl={3}>
          <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Toon minder landen' : 'Toon meer landen'}
          </ExpandButton>
        </Box>
      )}
    </Tile>
  );
}

const ExpandButton = styled.button(
  css({
    position: 'relative',
    padding: 0,
    margin: 0,
    border: 'none',
    background: 'none',
    font: 'inherit',
    color: 'blue',
    outline: 'inherit',
    cursor: 'pointer',

    '&:hover': {
      textDecoration: 'underline',
    },

    '&:focus': {
      textDecoration: 'underline',
      outlineWidth: '1px',
      outlineStyle: 'dashed',
      outlineColor: 'blue',
    },
  })
);
