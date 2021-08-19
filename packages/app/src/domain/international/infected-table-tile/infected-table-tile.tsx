import { InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Metadata, MetadataProps } from '~/components/metadata';
import { SearchInput } from '~/components/search-input';
import { Select } from '~/components/select';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowInfectedTable } from './components/narrow-infected-table';
import { WideInfectedTable } from './components/wide-infected-table';
import {
  positiveTestedSortOptions,
  SortIdentifier,
} from './logic/sort-options';
interface InfectedTableTileProps {
  data: InCollectionTestedOverall[];
  countryNames: Record<string, string>;
  metadata: MetadataProps;
}

export type FilterArrayType = {
  country_code: string;
  label: string;
};

export function InfectedTableTile({
  data,
  countryNames,
  metadata,
}: InfectedTableTileProps) {
  const { siteText } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;

  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [matchingCountries, setMatchingCountries] = useState(
    [] as FilterArrayType[]
  );
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

  /**
   * Get all the country names and their translation
   */
  const filterArray = useMemo(
    () =>
      data.map((item) => {
        return {
          country_code: item.country_code,
          label: countryNames[item.country_code.toLocaleLowerCase()],
        };
      }),
    [countryNames, data]
  );

  useEffect(() => {
    setMatchingCountries([
      ...matchSorter(filterArray, inputValue, {
        keys: ['country_code', 'label'],
      }),

      /**
       * Always show the Netherlands
       */
      {
        country_code: 'NLD',
        label: countryNames['nld'],
      },
    ]);
  }, [filterArray, inputValue, countryNames]);

  return (
    <ChartTile title={text.title} description={text.description}>
      <Box spacing={3}>
        <Box
          display="flex"
          flexDirection={{ _: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={{ _: 3, md: 0 }}
        >
          <SearchInput
            value={inputValue}
            setValue={setInputValue}
            placeholderText={text.search.placeholder}
          />

          <Box
            display="flex"
            alignItems={{ lg: 'center' }}
            flexDirection={{ _: 'column', lg: 'row' }}
          >
            <label css={css({ pr: 2, fontSize: 1 })}>{text.sorteer_op}</label>
            <Select
              options={sortOptions}
              onChange={setSortOption}
              value={sortOption}
            />
          </Box>
        </Box>

        {breakpoints.sm ? (
          <WideInfectedTable
            data={[...data].sort(positiveTestedSortOptions[sortOption])}
            isExpanded={isExpanded}
            matchingCountries={matchingCountries}
            countryNames={countryNames}
            inputValue={inputValue}
          />
        ) : (
          <NarrowInfectedTable
            data={[...data].sort(positiveTestedSortOptions[sortOption])}
            isExpanded={isExpanded}
            matchingCountries={matchingCountries}
            countryNames={countryNames}
            inputValue={inputValue}
          />
        )}

        {matchingCountries.length > data.length && (
          <Box display="flex" pl={{ _: 2, sm: 3 }}>
            <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? text.toon_minder : text.toon_meer}
            </ExpandButton>
          </Box>
        )}
      </Box>
      <Metadata {...metadata} isTileFooter />
    </ChartTile>
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
