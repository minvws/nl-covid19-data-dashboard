import { InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import { ReactNode, useMemo } from 'react';
import { Box } from '~/components/base';
import { inThresholds } from '~/components/choropleth/logic';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
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
  const intl = useIntl();
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  const formatValue = useMemo(() => {
    const numberOfDecimals = getMaximumNumberOfDecimals(
      data.map((x) => x.infected_per_100k_average ?? 0)
    );
    return (value: number) =>
      intl.formatPercentage(value, {
        minimumFractionDigits: numberOfDecimals,
        maximumFractionDigits: numberOfDecimals,
      });
  }, [intl, data]);

  return (
    <Box borderBottom="1px solid" borderBottomColor="silver">
      {data.map((item, index) =>
        inputValue.length === 0 ? (
          isExpanded || index < MAX_COUNTRIES_START ? (
            <ItemRow
              item={item}
              highestAverage={highestAverage?.infected_per_100k_average}
              countryNames={countryNames}
              formatValue={formatValue}
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
              formatValue={formatValue}
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
  formatValue: (value: number) => string;
}

function ItemRow({
  item,
  highestAverage,
  countryNames,
  formatValue,
}: ItemRowProps) {
  const { siteText } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;

  const filterBelow = getFilteredThresholdValues(
    inThresholds.infected_per_100k_average,
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
      <Row
        formatValue={formatValue}
        label={text.header_per_inwoners}
        value={item.infected_per_100k_average}
        bar={
          highestAverage && highestAverage > 0 ? (
            <Box color={filterBelow.color}>
              <PercentageBar
                percentage={
                  (item.infected_per_100k_average / highestAverage) * 100
                }
                height="12px"
              />
            </Box>
          ) : undefined
        }
      />
      <Row
        formatValue={formatValue}
        label={text.header_totale}
        value={item.infected}
      />
    </Box>
  );
}

function Row({
  formatValue,
  label,
  value,
  bar,
}: {
  formatValue: (value: number) => string;
  label: string;
  value: number;
  bar?: ReactNode;
}) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box flexShrink={1}>
        <InlineText>{label}:</InlineText>
      </Box>

      <Box minWidth={100}>
        <Box display="flex" alignItems="center" spacingHorizontal={2}>
          <Box textAlign="right">
            <InlineText fontWeight="bold">{formatValue(value)}</InlineText>
          </Box>
          {bar}
        </Box>
      </Box>
    </Box>
  );
}
