import css from '@styled-system/css';
import { maxBy } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { colors } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
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

const MAX_COUNTRIES = 5;

export function WideInfectedTable({
  data,
  isExpanded,
  matchedItems,
}: wideInfectedTableProps) {
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
              Land
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  sm: 150,
                  lg: 150,
                }),
              })}
            >
              Per 100.000 inwoners
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
              Totaal afgelopen 7 dagen:
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
            color="red"
          />
        )}
      </Cell>
      <Cell
        css={css({
          textAlign: 'right',
          pr: 3,
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
