import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isDefined } from 'ts-is-present';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { VariantsTable } from './components/variants-table';

export type TableText = {
  anderen_tooltip: string;
  omschrijving: string;
  omschrijving_zonder_placeholders: string;
  titel: string;
  kolommen: {
    aantal_monsters: string;
    eerst_gevonden: string;
    percentage: string;
    variant_titel: string;
    vorige_meeting: string;
  };
  verschil: { gelijk: string; meer: string; minder: string };
};

export function VariantsTableTile({
  text,
  noDataMessage = '',
  source,
  data,
  sampleSize,
  dates,
  children = null,
}: {
  text: TableText;
  noDataMessage?: ReactNode;
  data: VariantRow[] | undefined;
  source: {
    download: string;
    href: string;
    text: string;
  };
  sampleSize: number;
  dates?: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  } | null;
  children?: ReactNode | null;
}) {
  const { formatDateSpan } = useIntl();

  const metadata: MetadataProps | undefined = dates
    ? {
        date: [dates.date_start_unix, dates.date_end_unix],
        source,
        obtained: dates.date_of_insertion_unix,
      }
    : undefined;

  const [date_start, date_end] = dates
    ? formatDateSpan(
        { seconds: dates?.date_start_unix },
        { seconds: dates?.date_end_unix }
      )
    : [0, 0];

  const descriptionText = isDefined(data)
    ? replaceVariablesInText(text.omschrijving, {
        sample_size: sampleSize,
        date_start,
        date_end,
      })
    : text.omschrijving_zonder_placeholders;

  return (
    <Tile>
      <Heading level={3}>{text.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown content={descriptionText} />
      </Box>

      {children}

      <Box overflow="auto" mb={3} mt={4}>
        {isDefined(data) && (
          <ErrorBoundary>
            <VariantsTable rows={data} text={text} />
          </ErrorBoundary>
        )}
        {!isDefined(data) && <NoDataBox>{noDataMessage}</NoDataBox>}
      </Box>
      {isDefined(metadata) && <Metadata {...metadata} isTileFooter />}
    </Tile>
  );
}

const NoDataBox = styled.div(
  css({
    width: '100%',
    display: 'flex',
    height: '8em',
    color: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  })
);
