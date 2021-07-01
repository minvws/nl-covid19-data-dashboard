import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Select } from '~/components/select';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
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

const data = Array(20)
  .fill(null)
  .map((item, index) => {
    return {
      country_code:
        index === 3 ? 'NLD' : Math.random().toString(36).substr(2, 3),
      infected: randomIntFromInterval(10, 100),
      infected_per_100k_average: randomIntFromInterval(0, 100),
      date_start_unix: new Date(2021, 6, 19).getTime() / 1000,
      date_end_unix: new Date(2021, 6, 26).getTime() / 1000,
      date_of_insertion_unix: new Date(2021, 6, 26).getTime() / 1000,
    };
  });

export function InfectedTableTile() {
  const { siteText } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;

  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [matchedItems, setMatchedItems] = useState(['']);

  // ADD COMMENT WHY
  // setIsExpanded(false);

  const [sortOption, setSortOption] = useState<SortIdentifier>(
    'infected_per_100k_average_high_to_low'
  );

  const breakpoints = useBreakpoints();

  const sortOptions = useMemo(() => {
    const sortIdentifiers = Object.keys(
      positiveTestedSortOptions
    ) as SortIdentifier[];

    return sortIdentifiers.map((id) => {
      const label = text.sort_option[id];
      return {
        label: label,
        value: id,
      };
    });
  }, [text]);

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
      <Heading level={3}>{text.title}</Heading>
      <Box maxWidth="maxWidthText">
        <Text>{text.description}</Text>
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
            placeholderText={text.search.placeholder}
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
            {text.sorteer_op}
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
        <NarrowInfectedTable
          data={data.sort(positiveTestedSortOptions[sortOption])}
          isExpanded={isExpanded}
          matchedItems={matchedItems}
        />
      )}

      {matchedItems.length > data.length && (
        <Box display="flex" pl={{ _: 2, sm: 3 }} my={3}>
          <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? text.toon_minder : text.toon_meer}
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
