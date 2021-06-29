import css from '@styled-system/css';
import { useMemo, useState } from 'react';
// import styled from 'styled-components';
import { Box } from '~/components/base';
import { Select } from '~/components/select';
import { Tile } from '~/components/tile';
import { Heading, Text } from '~/components/typography';
import { SearchInput } from './components/search-input';
import {
  positiveTestedSortOptions,
  SortIdentifier,
} from './logic/sort-options';

export function PositiveTestedTableTile() {
  const [value, setValue] = useState('');

  const [sortOption, setSortOption] = useState<SortIdentifier>(
    'infected_per_100k_high_to_low'
  );

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

      <Box display="flex" justifyContent="space-between">
        <SearchInput
          value={value}
          setValue={setValue}
          placeholderText="Zoek een land"
        />

        <Box display="flex" alignItems="center">
          <label
            css={css({
              pr: 2,
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
    </Tile>
  );
}
