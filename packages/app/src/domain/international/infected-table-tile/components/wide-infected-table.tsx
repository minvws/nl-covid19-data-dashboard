import { InCollectionTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import { useMemo } from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { inThresholds } from '~/components/choropleth/logic';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { getMaximumNumberOfDecimals } from '~/utils/get-maximum-number-of-decimals';
import { FilterArrayType } from '../infected-table-tile';
import { MAX_COUNTRIES_START } from '../logic/common';
import { BarWithNumber } from './bar-with-number';

interface WideInfectedTableProps {
  data: InCollectionTestedOverall[];
  isExpanded: boolean;
  matchingCountries: FilterArrayType[];
  countryNames: Record<string, string>;
  inputValue: string;
}

export function WideInfectedTable({
  data,
  isExpanded,
  matchingCountries,
  countryNames,
  inputValue,
}: WideInfectedTableProps) {
  const intl = useIntl();
  const text =
    intl.siteText.internationaal_positief_geteste_personen.land_tabel;
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
    <Box overflow="auto">
      <StyledTable>
        <thead
          css={css({ borderBottom: '1px solid', borderBottomColor: 'silver' })}
        >
          <tr>
            <HeaderCell css={css({ pl: 3 })}>{text.header_land}</HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({ sm: 180, lg: 200, xl: 210 }),
              })}
            >
              {text.header_per_inwoners}
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: 3,
                width: asResponsiveArray({ sm: 200, lg: 220, xl: 260 }),
              })}
            >
              {text.header_totale}
            </HeaderCell>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) =>
            inputValue.length === 0 ? (
              isExpanded || index < MAX_COUNTRIES_START ? (
                <TableRow
                  item={item}
                  highestAverage={highestAverage?.infected_per_100k_average}
                  countryNames={countryNames}
                  formatValue={formatValue}
                />
              ) : null
            ) : (
              matchingCountries.some(
                (i) => i.country_code === item.country_code
              ) && (
                <TableRow
                  item={item}
                  highestAverage={highestAverage?.infected_per_100k_average}
                  countryNames={countryNames}
                  formatValue={formatValue}
                />
              )
            )
          )}
        </tbody>
      </StyledTable>
    </Box>
  );
}

interface tableRowProps {
  item: InCollectionTestedOverall;
  highestAverage: number | undefined;
  countryNames: Record<string, string>;
  formatValue: (value: number) => string;
}

function TableRow({
  item,
  highestAverage,
  countryNames,
  formatValue,
}: tableRowProps) {
  const { formatNumber } = useIntl();

  const filterBelow = getFilteredThresholdValues(
    inThresholds.infected_per_100k_average,
    item.infected_per_100k_average
  );

  return (
    <tr
      css={css({
        backgroundColor:
          item.country_code === 'NLD' ? colors.tileGray : undefined,
      })}
    >
      <Cell
        css={css({
          pl: 3,
        })}
      >
        <InlineText
          fontWeight={item.country_code === 'NLD' ? 'bold' : undefined}
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
      </Cell>
      <Cell>
        {highestAverage && highestAverage > 0 && (
          <BarWithNumber
            amount={item.infected_per_100k_average}
            percentage={(item.infected_per_100k_average / highestAverage) * 100}
            color={filterBelow.color}
            formatValue={formatValue}
          />
        )}
      </Cell>
      <Cell
        css={css({
          textAlign: 'right',
          pr: 3,
          fontWeight: ' bold',
        })}
      >
        {formatNumber(item.infected)}
      </Cell>
    </tr>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    fontWeight: 'normal',
    pb: 2,
    verticalAlign: 'middle',
  })
);

const Cell = styled.td(
  css({
    borderBottom: '1px solid',
    borderBottomColor: 'silver',
    p: 0,
    py: 2,
  })
);
