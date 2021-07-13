import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Markdown } from '~/components/markdown';
import { Metadata, MetadataProps } from '~/components/metadata';
import { Tile } from '~/components/tile';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { VariantRow } from '~/static-props/variants/get-variant-table-data';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { NarrowVariantsTable, WideVariantsTable } from './components';

export function VariantsTableTile({
  data,
  dates,
}: {
  data: VariantRow[];
  dates: {
    date_start_unix: number;
    date_end_unix: number;
    date_of_insertion_unix: number;
  };
}) {
  const { siteText, formatDateSpan } = useIntl();

  const text = siteText.covid_varianten;

  const breakpoints = useBreakpoints();

  const metadata: MetadataProps = {
    date: [dates.date_start_unix, dates.date_end_unix],
    source: text.bronnen.rivm,
    obtained: dates.date_of_insertion_unix,
  };

  const [date_start, date_end] = formatDateSpan(
    { seconds: data.date_start_unix },
    { seconds: data.date_end_unix }
  );

  return (
    <Tile>
      <Heading level={3}>{text.varianten_tabel.titel}</Heading>
      <Box maxWidth="maxWidthText">
        <Markdown
          content={replaceVariablesInText(text.varianten_tabel.omschrijving, {
            sample_size: data.sample_size,
            date_start,
            date_end,
          })}
        />
      </Box>

      {text.varianten_tabel.belangrijk_bericht && (
        <WarningTile
          message={text.varianten_tabel.belangrijk_bericht}
          variant="emphasis"
        />
      )}

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
