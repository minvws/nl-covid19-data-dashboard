import { colors, InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import { ReactNode, useMemo } from 'react';
import { Box } from '~/components/base';
import { thresholds } from '~/components/choropleth/logic/thresholds';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { Flag } from '~/domain/international/flag';
import { useIntl } from '~/intl';
import { getThresholdValue } from '~/utils/get-threshold-value';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { FilterArrayType } from '../infected-table-tile';
import { MAX_COUNTRIES_START } from '../logic/common';
import { SiteText } from '~/locale';

interface NarrowInfectedTableProps {
  data: InCollectionTestedOverall[];
  isExpanded: boolean;
  matchingCountries: FilterArrayType[];
  countryNames: Record<string, string>;
  inputValue: string;
  text: SiteText['pages']['in_positiveTestsPage']['shared'];
}
export function NarrowInfectedTable({
  data,
  isExpanded,
  matchingCountries,
  countryNames,
  inputValue,
  text,
}: NarrowInfectedTableProps) {
  const { formatPercentage } = useIntl();
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  const formatValue = useMemo(() => {
    const numberOfDecimals = getMaximumNumberOfDecimals(
      data.map((x) => x.infected_per_100k_average ?? 0)
    );
    return (value: number) =>
      formatPercentage(value, {
        minimumFractionDigits: numberOfDecimals,
        maximumFractionDigits: numberOfDecimals,
      });
  }, [formatPercentage, data]);

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
              text={text}
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
              text={text}
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
  text: SiteText['pages']['in_positiveTestsPage']['shared'];
}

function ItemRow({
  item,
  highestAverage,
  countryNames,
  formatValue,
  text,
}: ItemRowProps) {
  const filterBelow = getThresholdValue(
    thresholds.in.infected_per_100k_average,
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
        <Box mr={2}>
          <Flag countryCode={item.country_code} />
        </Box>

        {countryNames[item.country_code.toLocaleLowerCase()]}
      </InlineText>
      <Row
        formatValue={formatValue}
        label={text.land_tabel.header_per_inwoners}
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
        label={text.land_tabel.header_totale}
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
