import css from '@styled-system/css';
import { maxBy } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
// NEED TO CHANGE
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { getFilteredThresholdValues } from '~/utils/get-filtered-threshold-values';
import { BarWithNumber } from './bar-with-number';

type singleItem = {
  country_code: string;
  infected: number;
  infected_per_100k_average: number;
  date_start_unix: number;
  date_end_unix: number;
  date_of_insertion_unix: number;
};

interface wideInfectedTableProps {
  data: singleItem[];
  isExpanded: boolean;
  matchedItems: any[]; // CHANGE
}

const MAX_COUNTRIES = 10;

export function WideInfectedTable({
  data,
  isExpanded,
  matchedItems,
}: wideInfectedTableProps) {
  const { siteText } = useIntl();
  const text = siteText.internationaal_positief_geteste_personen.land_tabel;
  const highestAverage = maxBy(data, (x) => x.infected_per_100k_average);

  return (
    <Box overflow="auto" mb={3}>
      <StyledTable>
        <thead
          css={css({
            borderBottom: '1px solid lightGray',
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
          {data.map((item, index) => (
            <>
              {matchedItems.length > data.length ? (
                <>
                  {isExpanded || index < MAX_COUNTRIES ? (
                    <TableRow
                      item={item}
                      highestAverage={highestAverage?.infected_per_100k_average}
                    />
                  ) : null}
                </>
              ) : (
                <>
                  {matchedItems.includes(item.country_code) && (
                    <TableRow
                      item={item}
                      highestAverage={highestAverage?.infected_per_100k_average}
                    />
                  )}
                </>
              )}
            </>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
}

interface tableRowProps {
  item: singleItem;
  highestAverage: number | undefined;
}

function TableRow({ item, highestAverage }: tableRowProps) {
  const filterBelow = getFilteredThresholdValues(
    regionThresholds.situations.gathering,
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
        >
          Land: {item.country_code}
        </InlineText>
      </Cell>
      <Cell>
        {highestAverage && (
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
        {item.infected}
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
    borderBottomColor: 'lightGray',
    p: 0,
    py: 2,
  })
);

// internationaal_positief_geteste_personen.land_tabel.title _'Aantal positief geteste mensen per land'
// internationaal_positief_geteste_personen.land_tabel.description 'Deze tabel laat per land en voor Europa zien van hoeveel mensen gemeld is dat ze positief getest zijn op het coronavirus. Dit wordt berekend per 100.000 inwoners en gemiddeld over de afgelopen zeven dagen. Via de zoekfunctie kunt u een land selecteren.'

// internationaal_positief_geteste_personen.land_tabel.search.placeholder 'Zoek een land'
// internationaal_positief_geteste_personen.land_tabel.search.clear 'Zoekopdracht wissen'

// internationaal_positief_geteste_personen.land_tabel.sorteer_op 'Sorteer op:'
// internationaal_positief_geteste_personen.land_tabel.sort_option.infected_per_100k_average_high_to_low 'Per 100.000 inwoners, hoog naar laag'
// internationaal_positief_geteste_personen.land_tabel.sort_option.infected_per_100k_average_low_to_high 'Per 100.000 inwoners, laag naar hoog'
// internationaal_positief_geteste_personen.land_tabel.sort_option.infected_high_to_low 'Totale afgelopen 7 dagen, hoog naar laag'
// internationaal_positief_geteste_personen.land_tabel.sort_option.infected_low_to_high 'Totale afgelopen 7 dagen, laag naar hoog'

// internationaal_positief_geteste_personen.land_tabel.header_land 'Land'
// internationaal_positief_geteste_personen.land_tabel.header_per_inwoners 'Per 100.000 inwoners'
// internationaal_positief_geteste_personen.land_tabel.header_totale 'Totale afgelopen 7 dagen'

// internationaal_positief_geteste_personen.land_tabel.toon_meer 'Toon meer landen'
// internationaal_positief_geteste_personen.land_tabel.toon_minder 'Toon minder landen'
