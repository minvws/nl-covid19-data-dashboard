import { InTestedOverall } from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { internationalThresholds } from '~/components/choropleth/international-thresholds';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { filterArrayType } from '../infected-table-tile';
import { MAX_COUNTRIES_START } from '../logic/common';
import { BarWithNumber } from './bar-with-number';
interface wideInfectedTableProps {
  data: InTestedOverall[];
  isExpanded: boolean;
  matchingCountries: filterArrayType[];
  countryNames: Record<string, string>;
  inputValue: string;
}

export function WideInfectedTable({
  data,
  isExpanded,
  matchingCountries,
  countryNames,
  inputValue,
}: wideInfectedTableProps) {
  const { siteText } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  return (
    <Box overflow="auto">
      <StyledTable>
        <thead
          css={css({
            borderBottom: '1px solid',
            borderBottomColor: 'silver',
          })}
        >
          <tr>
            <HeaderCell
              css={css({
                pl: 3,
              })}
            >
              {text.header_land}
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  sm: 150,
                  lg: 150,
                }),
              })}
            >
              {text.header_per_inwoners}
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: 3,
                width: asResponsiveArray({
                  sm: 150,
                  lg: 220,
                }),
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
  item: InTestedOverall;
  highestAverage: number | undefined;
  countryNames: Record<string, string>;
}

function TableRow({ item, highestAverage, countryNames }: tableRowProps) {
  const { formatNumber } = useIntl();

  const filterBelow = getFilteredThresholdValues(
    internationalThresholds.infected_per_100k_average,
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
