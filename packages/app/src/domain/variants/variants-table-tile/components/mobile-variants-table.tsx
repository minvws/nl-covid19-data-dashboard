import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@reach/disclosure';
import css from '@styled-system/css';
import { useState } from 'react';
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
  VariantCell,
} from '.';
import { VariantRow } from '../logic/use-variants-table-data';
import { Samples } from './samples';
import { VariantDiff } from './variant-diff';

type ColumnKeys =
  keyof SiteText['covid_varianten']['varianten_tabel']['kolommen'];

const columnKeys: ColumnKeys[] = ['variant_titel', 'percentage'];

type MobileVariantsTableProps = {
  rows: VariantRow[];
  text: SiteText['covid_varianten'];
};

export function MobileVariantsTable(props: MobileVariantsTableProps) {
  const { rows, text } = props;
  const columnNames = text.varianten_tabel.kolommen;

  return (
    <StyledTable>
      <thead>
        <tr>
          {columnKeys.map((key) => (
            <HeaderCell key={key}>{columnNames[key]}</HeaderCell>
          ))}
          <HeaderCell />
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
  const [open, setOpen] = useState(false);
  const { ref, height: contentHeight } = useResizeObserver();
  const columnNames = text.varianten_tabel.kolommen;

  return (
    <>
      <tr key={row.variant}>
        <VariantCell variant={row.variant} text={text} compact />
        <Cell>
          <PercentageBarWithNumber
            percentage={row.percentage}
            color={row.color}
          />
        </Cell>
        <Cell>
          <Disclosure
            open={open}
            onChange={() => {
              setOpen((x) => !x);
            }}
          >
            <Chevron />
          </Disclosure>
        </Cell>
      </tr>
      <tr>
        <Cell colSpan={3} border>
          <Panel
            style={{
              height: open ? contentHeight : 0,
            }}
          >
            <div ref={ref}>
              <Box mb={1}>
                {columnNames['aantal_monsters']}:{' '}
                <Samples
                  occurrence={row.occurrence}
                  sampleSize={row.sampleSize}
                />
              </Box>
              <Box mb={1}>
                {columnNames['vorige_meeting']}:{' '}
                {row.difference && <VariantDiff value={row.difference} />}
              </Box>
              <Box mb={1}>
                {columnNames['eerst_gevonden']}:{' '}
                <InlineText>{row.countryOfOrigin}</InlineText>
              </Box>
            </div>
          </Panel>
        </Cell>
      </tr>
    </>
  );
}

const Chevron = styled((props) => <DisclosureButton {...props} />)(
  css({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    m: 0,
    p: 3,
    overflow: 'visible',
    width: '100%',
    bg: 'transparent',
    border: 'none',
    color: 'lightGray',
    fontSize: '1.25rem',
    textAlign: 'left',
    position: 'relative',
    cursor: 'pointer',

    '&::after': {
      backgroundImage: 'url("/images/chevron-down.svg")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0.9em 0.55em',
      content: '""',
      flex: '0 0 1.9em',
      height: '0.55em',
      ml: 'auto',
      mr: -2,
      mt: '0.35em',
      py: 0,
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
    px: 3,
    py: 0,
    transition: 'height 0.4s ease-in-out, opacity 0.4s ease-in-out',
  })
);
