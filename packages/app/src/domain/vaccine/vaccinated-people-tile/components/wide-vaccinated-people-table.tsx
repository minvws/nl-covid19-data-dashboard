import React from 'react';
import css from '@styled-system/css';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, Row, StyledTable } from '.';
import { Box } from '~/components/base';

interface WideVaccinatedPeopleTableProps {
  rows: any[];
  columns: any[];
}

export const WideVaccinatedPeopleTable = ({
  columns,
  rows,
}: WideVaccinatedPeopleTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          {columns.map((column) => (
            <HeaderCell key={column}>{column}</HeaderCell>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <VaccinatedPeopleRow
            key={row.title}
            row={row}
            rows={rows}
            index={index}
          />
        ))}
      </tbody>
    </StyledTable>
  );
};

const VaccinatedPeopleRow = ({
  row,
  rows,
  index,
}: {
  row: any;
  rows: any;
  index: number;
}) => {
  const collapsible = useCollapsible({ isOpen: index === 0 });
  const isOpen = collapsible.isOpen;

  return (
    <Row
      isLast={index + 1 === rows.length}
      isOpen={isOpen}
      onClick={() => collapsible.toggle()}
    >
      <Cell colSpan={4} css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell css={css({ fontWeight: 'bold' })}>{row.title}</Cell>
              <Cell>
                {isOpen ? (
                  <strong>{row.previousWeek}</strong>
                ) : (
                  <>{row.previousWeek}</>
                )}
              </Cell>
              <Cell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {isOpen ? <strong>{row.total}</strong> : <>{row.total}</>}

                  {collapsible.button()}
                </Box>
              </Cell>
            </tr>

            <tr>
              <Cell colSpan={4} css={css({ pb: isOpen ? 4 : 0, pt: 0 })}>
                {collapsible.content(row.description)}
              </Cell>
            </tr>
          </tbody>
        </StyledTable>
      </Cell>
    </Row>
  );
};
