import { InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import { Box } from '~/components/base';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { InlineText, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { FilterArrayType } from '../infected-table-tile';
import { MAX_COUNTRIES_START } from '../logic/common';

interface NarrowInfectedTableProps {
  data: InCollectionTestedOverall[];
  isExpanded: boolean;
  matchingCountries: FilterArrayType[];
  countryNames: Record<string, string>;
  inputValue: string;
}
export function NarrowInfectedTable({
  data,
  isExpanded,
  matchingCountries,
  countryNames,
  inputValue,
}: NarrowInfectedTableProps) {
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  return (
    <Box borderBottom="1px solid" borderBottomColor="silver">
      {data.map((item, index) =>
        inputValue.length === 0 ? (
          isExpanded || index < MAX_COUNTRIES_START ? (
            <ItemRow
              item={item}
              highestAverage={highestAverage?.infected_per_100k_average}
              countryNames={countryNames}
              key={index}
            />
          ) : null
        ) : (
          matchingCountries.some(
            (i) => i.country_code === item.country_code
          ) && (
            <ItemRow
              item={item}
              highestAverage={highestAverage?.infected_per_100k_average}
              countryNames={countryNames}
              key={index}
            />
          )
        )
      )}
    </Box>
  );
}

interface ItemRowProps {
  item: InCollectionTestedOverall;
  highestAverage: number | undefined;
  countryNames: Record<string, string>;
}

function ItemRow({ item, highestAverage, countryNames }: ItemRowProps) {
  const { siteText, formatNumber } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;

  const filterBelow = getFilteredThresholdValues(
    internationalThresholds.infected_per_100k_average,
    item.infected_per_100k_average
  );

  return (
    <Box
      borderBottom="1px solid"
      borderBottomColor="silver"
      py={3}
      px={2}
      spacing={1}
      backgroundColor={
        item.country_code === 'NLD' ? colors.tileGray : undefined
      }
    >
      <InlineText
        fontWeight="bold"
        css={css({
          display: 'flex',
          alignItems: 'center',
        })}
      >
        <img
          aria-hidden
          src={`/icons/flags/${item.country_code.toLowerCase()}.svg`}
          width="17"
          height="13"
          alt=""
          css={css({
            mr: 2,
          })}
        />
        {countryNames[item.country_code.toLocaleLowerCase()]}
      </InlineText>
      <Box display="flex">
        <Text
          mb={0}
          css={css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          })}
        >
          {text.header_per_inwoners}:
          <InlineText fontWeight="bold" px={{ _: 2, xs: 3 }} textAlign="right">
            {formatNumber(item.infected_per_100k_average)}
          </InlineText>
        </Text>

        {highestAverage && highestAverage > 0 && (
          <Box maxWidth={{ _: '5rem', xs: '6rem' }} width="100%">
            <Box
              width={`${
                (item.infected_per_100k_average / highestAverage) * 100
              }%`}
              minWidth="3px"
              height="12px"
              backgroundColor={filterBelow.color}
              mt="6px"
            />
          </Box>
        )}
      </Box>

      <Box display="flex">
        <Text
          mb={0}
          pr={{ _: '5rem', xs: '6rem' }}
          css={css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          })}
        >
          {text.header_totale}:
          <InlineText fontWeight="bold" px={{ _: 2, xs: 3 }} textAlign="right">
            {formatNumber(item.infected)}
          </InlineText>
        </Text>
      </Box>
    </Box>
  );
}
