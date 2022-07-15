import React from 'react';
import css from '@styled-system/css';
import { colors } from '@corona-dashboard/common';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, StyledTable } from '.';

interface NarrowVaccinatedPeopleTableProps {
  rows: any[];
  columns: any[];
}

export const NarrowVaccinatedPeopleTable = ({
  columns,
  rows,
}: NarrowVaccinatedPeopleTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          {columns.filter(
            (column) =>
              column === 'campaign' && (
                <HeaderCell key={column}>{column}</HeaderCell>
              )
          )}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <VaccinatedPeopleRow
            key={row.title}
            index={index}
            row={row}
            rows={rows}
            columns={columns}
          />
        ))}
      </tbody>
    </StyledTable>
  );
};

const VaccinatedPeopleRow = ({
  columns,
  row,
  rows,
  index,
}: {
  columns: any;
  row: any;
  rows: any;
  index: number;
}) => {
  const collapsible = useCollapsible({ isOpen: index === 0 });
  const isOpen = collapsible.isOpen;

  return (
    <>
      <tr
        css={css({
          borderTop: '1px solid',
          borderTopColor: isOpen ? colors.blue : 'lightGray',
          cursor: 'pointer',
          fontWeight: 'bold',
        })}
        onClick={() => collapsible.toggle()}
      >
        <Cell mobile isOpen={isOpen}>
          {row.title}
        </Cell>

        <Cell alignRight mobile isOpen={isOpen}>
          {collapsible.button()}
        </Cell>
      </tr>

      {columns
        .filter((column) => column !== 'campaign')
        .map((column) => (
          <tr key={column}>
            <Cell colSpan={2} css={css({ py: 0 })} mobile isOpen={isOpen}>
              {column}: {isOpen ? <b>xx.xxx</b> : <>xx.xxx</>}
            </Cell>
          </tr>
        ))}

      <tr
        css={css({
          borderBottom: index + 1 === rows.length ? '1px solid' : undefined,
          borderBottomColor: isOpen ? colors.blue : 'lightGray',
        })}
      >
        <Cell
          colSpan={2}
          css={css({
            borderBottom: isOpen ? '1px solid' : undefined,
            borderBottomColor: isOpen ? colors.blue : undefined,
          })}
          mobile
          isOpen={isOpen}
        >
          {collapsible.content(row.description)}
        </Cell>
      </tr>
    </>
  );
};
