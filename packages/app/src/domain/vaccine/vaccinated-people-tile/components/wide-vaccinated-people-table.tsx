import React from 'react';
import css from '@styled-system/css';
import { colors } from '@corona-dashboard/common';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, StyledTable } from '.';

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
          {columns.map((column, index) => (
            <HeaderCell
              key={column}
              colSpan={index + 1 === columns.length ? 2 : 1}
            >
              {column}
            </HeaderCell>
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
    <>
      <tr
        css={css({
          borderTop: '1px solid',
          borderTopColor: isOpen ? colors.blue : 'lightGray',
          cursor: 'pointer',
        })}
        onClick={() => collapsible.toggle()}
      >
        <Cell css={css({ fontWeight: 'bold' })} isOpen={isOpen}>
          {row.title}
        </Cell>
        <Cell isOpen={isOpen}>
          {isOpen ? <b>{row.previousWeek}</b> : <>{row.previousWeek}</>}
        </Cell>
        <Cell isOpen={isOpen}>
          {isOpen ? <b>{row.total}</b> : <>{row.total}</>}
        </Cell>
        <Cell alignRight isOpen={isOpen}>
          {collapsible.button()}
        </Cell>
      </tr>

      <tr
        css={css({
          borderBottom: index + 1 === rows.length ? '1px solid' : undefined,
          borderBottomColor: isOpen ? colors.blue : 'lightGray',
        })}
      >
        <Cell
          colSpan={4}
          css={css({
            borderBottom: isOpen ? '1px solid' : undefined,
            borderBottomColor: isOpen ? colors.blue : undefined,
            pb: isOpen ? 4 : 0,
            pt: 0,
          })}
          isOpen={isOpen}
        >
          {collapsible.content(row.description)}
        </Cell>
      </tr>
    </>
  );
};
