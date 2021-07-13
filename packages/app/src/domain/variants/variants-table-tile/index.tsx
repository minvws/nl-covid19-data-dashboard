import { ReactNode } from 'react';
import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVariantsTable, WideVariantsTable } from './components';

export type TableText = {
  anderen_tooltip: string;
  omschrijving: string;
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
  source,
  data,
  sampleSize,
  dates,
  children = null,
}: {
  text: TableText;
  data: VariantRow[] | undefined;
  source: {
    download: string;
    href: string;
    text: string;
  };
  sampleSize: number;
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  };
  children?: ReactNode | null;
}) {
  const { formatDateSpan } = useIntl();

  const breakpoints = useBreakpoints();

  const metadata: MetadataProps = {
    date: [dates.date_start_unix, dates.date_end_unix],
    source,
    obtained: dates.date_of_insertion_unix,
  };

  const [date_start, date_end] = formatDateSpan(
    { seconds: dates.date_start_unix },
    { seconds: dates.date_end_unix }
  );

  return (
    <Tile>
      <Heading level={3}>{text.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown
          content={replaceVariablesInText(text.omschrijving, {
            sample_size: sampleSize,
            date_start,
            date_end,
          })}
        />
      </Box>

      {children}

      <Box overflow="auto" mb={3} mt={4}>
        <ErrorBoundary>
          {breakpoints.sm ? (
            <WideVariantsTable rows={data} text={text} />
          ) : (
            <NarrowVariantsTable rows={data} text={text} />
          )}
        </ErrorBoundary>
      </Box>
      <Metadata {...metadata} isTileFooter />
    </Tile>
  );
}
