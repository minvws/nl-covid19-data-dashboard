import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import css from '@styled-system/css';
import { forwardRef, MouseEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { SiteText } from '~/locale';
import {
  Cell,
  HeaderCell,
  PercentageBarWithNumber,
  StyledTable,
  VariantDifference,
  VariantNameCell,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';

type NarrowVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function NarrowVariantsTable(props: NarrowVariantsTableProps) {
  const { rows, text } = props;
  const columnNames = text.varianten_tabel.kolommen;

  return (
    <StyledTable>
      <thead>
        <tr>
          <HeaderCell>{columnNames.variant_titel}</HeaderCell>
          <HeaderCell colSpan={2}>{columnNames.percentage}</HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <MobileVariantRow row={row} text={text} key={row.variant} />
        ))}
      </tbody>
    </StyledTable>
  );
}

type MobileVariantRowProps = {
  row: VariantRow;
  text: SiteText['covid_varianten'];
};

function MobileVariantRow(props: MobileVariantRowProps) {
  const { row, text } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { ref, height: contentHeight } = useResizeObserver();
  const columnNames = text.varianten_tabel.kolommen;

  const chevronRef = useRef<HTMLButtonElement>();

  function handleRowClick(event: MouseEvent) {
    if (event.target !== chevronRef.current) {
      setIsOpen((x) => !x);
    }
  }

  return (
    <>
      <tr onClick={handleRowClick}>
        <VariantNameCell variant={row.variant} text={text} mobile narrow />
        <Cell mobile>
          <PercentageBarWithNumber
            percentage={row.percentage}
            color={row.color}
          />
        </Cell>
        <Cell mobile alignRight>
          <Disclosure
            open={isOpen}
            onChange={() => {
              setIsOpen((x) => !x);
            }}
          >
            <Chevron ref={chevronRef as any} />
          </Disclosure>
        </Cell>
      </tr>
      <tr>
        <MobileCell colSpan={3}>
          <Panel
            style={{
              height: isOpen ? contentHeight : 0,
            }}
          >
            <div ref={ref}>
              <Box mb={1} display="flex" flexDirection="row">
                <InlineText mr={1}>{columnNames['vorige_meeting']}:</InlineText>
                <VariantDifference value={row.difference} />
              </Box>
              <Box>
                {columnNames['eerst_gevonden']}:{' '}
                <InlineText>{row.countryOfOrigin}</InlineText>
              </Box>
            </div>
          </Panel>
        </MobileCell>
      </tr>
    </>
  );
}

const Chevron = styled(
  forwardRef((props, ref) => <DisclosureButton {...(props as any)} ref={ref} />)
)(
  css({
    display: 'flex',
    alignItems: 'flex-end',
    m: 0,
    p: 0,
    pb: 0,
    overflow: 'visible',
    bg: 'transparent',
    border: 'none',
    color: 'lightGray',
    fontSize: '1.25rem',
    cursor: 'pointer',

    '&::after': {
      backgroundImage: 'url("/images/chevron-down.svg")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0.9em 0.55em',
      content: '""',
      width: '0.9em',
      height: '0.55em',
      mt: '0.35em',
      p: 0,
      transition: 'transform 0.4s ease-in-out',
    },

    '&[data-state="open"]:after': {
      transform: 'rotate(180deg)',
    },
  })
);

const Panel = styled((props) => <DisclosurePanel {...props} />)(
  css({
    display: 'block',
    opacity: 1,
    overflow: 'hidden',
    p: 0,
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
  })
);

const MobileCell = styled.td(
  css({
    p: 0,
    borderBottom: '1px solid',
    borderBottomColor: 'lightGray',
  })
);
