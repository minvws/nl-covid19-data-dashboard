import React from 'react';
import css from '@styled-system/css';
import { useCollapsible } from '~/utils/use-collapsible';
import { Cell, HeaderCell, Row, StyledTable } from '.';

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
          {columns
            .filter((column) => column === 'Vaccine')
            .map((column) => (
              <HeaderCell key={column} mobile>
                {column}
              </HeaderCell>
            ))}
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
    <Row
      isLast={index + 1 === rows.length}
      isOpen={isOpen}
      onClick={() => collapsible.toggle()}
    >
      <Cell css={css({ p: 0 })}>
        <StyledTable>
          <tbody>
            <tr>
              <Cell css={css({ pt: 3 })} mobile>
                <strong>{row.title}</strong>
              </Cell>

              <Cell css={css({ pt: 3 })} alignRight mobile>
                {collapsible.button()}
              </Cell>
            </tr>

            {columns
              // TODO: this is supposed to be different (matching with data coming from BE)
              .filter((column) => column !== 'Vaccine')
              .map((column) => (
                <tr key={column}>
                  <Cell css={css({ py: 0 })} mobile>
                    {column}: {isOpen ? <strong>xx.xxx</strong> : <>xx.xxx</>}
                  </Cell>
                </tr>
              ))}

            <tr>
              <Cell
                css={css({ pb: collapsible.isOpen ? 3 : 2 })}
                colSpan={2}
                mobile
              >
                {collapsible.content(row.description)}
              </Cell>
            </tr>
          </tbody>
        </StyledTable>
      </Cell>
    </Row>
  );
};
