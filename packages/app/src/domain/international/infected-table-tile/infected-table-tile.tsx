import { InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { matchSorter } from 'match-sorter';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { Metadata, MetadataProps } from '~/components/metadata';
import { RichContentSelect } from '~/components/rich-content-select';
import { SearchInput } from '~/components/search-input';
import { SiteText } from '~/locale';
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
  text: SiteText['pages']['in_positiveTestsPage']['shared'];
}

export type FilterArrayType = {
  country_code: string;
  label: string;
};

export function InfectedTableTile({
  data,
  countryNames,
  metadata,
  text,
}: InfectedTableTileProps) {
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
      const label = text.land_tabel.sort_option[id];
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
    <ChartTile
      title={text.land_tabel.title}
      description={text.land_tabel.description}
    >
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
            placeholderText={text.land_tabel.search.placeholder}
          />

          <Box
            display="flex"
            alignItems={{ lg: 'center' }}
            flexDirection={{ _: 'column', lg: 'row' }}
          >
            <label css={css({ pr: 2, fontSize: 1 })}>
              {text.land_tabel.sorteer_op}
            </label>
            <RichContentSelect
              label={text.land_tabel.sorteer_op}
              visuallyHiddenLabel
              initialValue={sortOption}
              options={sortOptions}
              onChange={(option) => setSortOption(option.value)}
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
            text={text}
          />
        ) : (
          <NarrowInfectedTable
            data={[...data].sort(positiveTestedSortOptions[sortOption])}
            isExpanded={isExpanded}
            matchingCountries={matchingCountries}
            countryNames={countryNames}
            inputValue={inputValue}
            text={text}
          />
        )}

        {matchingCountries.length > data.length && (
          <Box display="flex" pl={{ _: 2, sm: 3 }}>
            <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded
                ? text.land_tabel.toon_minder
                : text.land_tabel.toon_meer}
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
